import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import VoiceMicButton from './components/VoiceMicButton';
import SearchBar from './components/SearchBar';
import WordCard from './components/WordCard';
import WordOfTheDay from './components/WordOfTheDay';
import HistoryFavoritesModal from './components/HistoryFavoritesModal';
import PronunciationPracticeModal from './components/PronunciationPracticeModal';
import { getWordOfTheDay, WORDS_OF_THE_DAY } from './data/wordsOfTheDay';
import { fetchWord } from './utils/dictionaryService';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
  extractWordFromVoice
} from './utils/speechRecognition';
import {
  speakText,
  speakWordDefinition,
  stopSpeech,
  playPronunciation,
  isSpeechSynthesisSupported
} from './utils/speechSynthesis';
import { Sparkles, AlertCircle, Volume2 } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('voxlex_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Auto-speak state - defaults to true to automatically trigger speech upon fetching
  const [autoSpeak, setAutoSpeak] = useState(() => {
    const saved = localStorage.getItem('voxlex_autospeak');
    return saved !== null ? saved === 'true' : true;
  });

  // Search & Word states
  const [currentWordData, setCurrentWordData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Fallback ref for the manual search text input box
  const searchInputRef = useRef(null);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [isVoiceBlocked, setIsVoiceBlocked] = useState(false);
  const recognizerRef = useRef(null);

  // Audio & Speech playback states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingDefinition, setIsPlayingDefinition] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState(null);
  const currentAudioRef = useRef(null);

  // Word of the Day state (Requirement 3: Rotating word based on current date)
  const [wordOfTheDay, setWordOfTheDay] = useState(() => getWordOfTheDay(new Date()));
  const [wotdIndex, setWotdIndex] = useState(0);

  // Pronunciation Practice Mode state (Requirement 2: Practice Speaking feature)
  const [practiceTarget, setPracticeTarget] = useState(null);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);

  // Library & History states
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('voxlex_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('voxlex_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize Theme class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('voxlex_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('voxlex_theme', 'light');
    }
  }, [isDark]);

  // Persist Auto-speak setting
  useEffect(() => {
    localStorage.setItem('voxlex_autospeak', autoSpeak ? 'true' : 'false');
  }, [autoSpeak]);

  // Persist History
  useEffect(() => {
    localStorage.setItem('voxlex_history', JSON.stringify(history.slice(0, 30)));
  }, [history]);

  // Persist Favorites
  useEffect(() => {
    localStorage.setItem('voxlex_favorites', JSON.stringify(favorites));
  }, [favorites]);


  // Cleanup audio & speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
    };
  }, []);

  // Open Pronunciation Practice Mode for a given word
  const handleOpenPractice = ({ word, phonetic, audioUrl }) => {
    stopSpeech();
    setActiveSpeakingId(null);
    setPracticeTarget({ word, phonetic, audioUrl });
    setIsPracticeModalOpen(true);
  };

  const handleClosePractice = () => {
    setIsPracticeModalOpen(false);
    setPracticeTarget(null);
  };

  // Fallback to manual typing handler
  const handleFallbackToTyping = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handler: Manual speech for any individual definition or example sentence
  const handleSpeakSpecificText = (text, id) => {
    if (activeSpeakingId === id) {
      stopSpeech();
      setActiveSpeakingId(null);
      setIsPlayingDefinition(false);
      return;
    }

    stopSpeech();
    setActiveSpeakingId(id);
    setIsPlayingDefinition(true);

    speakText(text, {
      onStart: () => {
        setActiveSpeakingId(id);
        setIsPlayingDefinition(true);
      },
      onEnd: () => {
        setActiveSpeakingId(null);
        setIsPlayingDefinition(false);
      },
      onError: () => {
        setActiveSpeakingId(null);
        setIsPlayingDefinition(false);
      }
    });
  };

  // Handler: Execute Word Search (Requirement 1: Public Dictionary API + Local Fallback)
  const handleSearchWord = async (wordToSearch) => {
    if (!wordToSearch || !wordToSearch.trim()) return;

    const query = wordToSearch.trim();
    setIsLoading(true);
    setSearchError('');
    setVoiceError('');
    setIsVoiceBlocked(false);
    stopSpeech();
    setActiveSpeakingId(null);

    try {
      const data = await fetchWord(query);
      setCurrentWordData(data);

      // Add to search history
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.word.toLowerCase() !== data.word.toLowerCase());
        return [{ word: data.word, phonetic: data.phonetic, timestamp: Date.now() }, ...filtered];
      });

      // Automatically trigger speech when a word meaning or example is fetched successfully
      if (autoSpeak && isSpeechSynthesisSupported()) {
        const firstMeaning = data.meanings[0];
        const firstDef = firstMeaning?.definitions[0]?.definition || '';
        const firstEx = firstMeaning?.definitions[0]?.example || '';
        const pos = firstMeaning?.partOfSpeech || '';

        if (firstDef) {
          setActiveSpeakingId('full-def');
          setIsPlayingDefinition(true);

          speakWordDefinition(data.word, pos, firstDef, firstEx, {
            onStart: () => {
              setActiveSpeakingId('full-def');
              setIsPlayingDefinition(true);
            },
            onEnd: () => {
              setActiveSpeakingId(null);
              setIsPlayingDefinition(false);
            },
            onError: () => {
              setActiveSpeakingId(null);
              setIsPlayingDefinition(false);
            },
          });
        }
      }
    } catch (err) {
      setSearchError(err.message || 'Could not find word definition.');
      setCurrentWordData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Speech Recognition
  const handleToggleListening = () => {
    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      setLiveTranscript('');
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceError('Voice input is not supported in this browser. Please use the manual typing box below.');
      setIsVoiceBlocked(true);
      return;
    }

    stopSpeech();
    setActiveSpeakingId(null);
    setVoiceError('');
    setIsVoiceBlocked(false);
    setLiveTranscript('');

    const recognizer = createSpeechRecognizer({
      onStart: () => {
        setIsListening(true);
        setVoiceError('');
        setIsVoiceBlocked(false);
      },
      onInterimResult: (transcript) => {
        setLiveTranscript(transcript);
      },
      onFinalResult: (transcript) => {
        setIsListening(false);
        setLiveTranscript('');

        const extractedWord = extractWordFromVoice(transcript);
        if (extractedWord) {
          handleSearchWord(extractedWord);
        } else {
          setVoiceError('Could not identify a word from your speech. Please try speaking again or type below.');
        }
      },
      onError: ({ message, isBlocked }) => {
        setIsListening(false);
        setLiveTranscript('');
        setVoiceError(message);
        setIsVoiceBlocked(isBlocked);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch {
        setVoiceError('Unable to access microphone. Please check your browser microphone settings.');
        setIsVoiceBlocked(true);
        setIsListening(false);
      }
    }
  };

  // Handler: Pronounce audio
  const handlePlayPronunciation = ({ audioUrl, word }) => {
    stopSpeech();
    setActiveSpeakingId(null);
    setIsPlayingAudio(true);

    const audioObj = playPronunciation({
      audioUrl,
      word,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
    currentAudioRef.current = audioObj;
  };

  // Handler: Voice assistant read full definition aloud
  const handlePlayFullDefinition = () => {
    if (!currentWordData) return;
    const firstMeaning = currentWordData.meanings[0];
    const firstDef = firstMeaning?.definitions[0]?.definition || '';
    const firstEx = firstMeaning?.definitions[0]?.example || '';
    const pos = firstMeaning?.partOfSpeech || '';

    if (isPlayingDefinition && activeSpeakingId === 'full-def') {
      stopSpeech();
      setActiveSpeakingId(null);
      setIsPlayingDefinition(false);
      return;
    }

    stopSpeech();
    setActiveSpeakingId('full-def');
    setIsPlayingDefinition(true);

    speakWordDefinition(currentWordData.word, pos, firstDef, firstEx, {
      onStart: () => {
        setActiveSpeakingId('full-def');
        setIsPlayingDefinition(true);
      },
      onEnd: () => {
        setActiveSpeakingId(null);
        setIsPlayingDefinition(false);
      },
      onError: () => {
        setActiveSpeakingId(null);
        setIsPlayingDefinition(false);
      },
    });
  };

  // Handler: Favorite / Bookmark
  const handleToggleFavorite = (wordItem) => {
    const isFav = favorites.some((f) => f.word.toLowerCase() === wordItem.word.toLowerCase());
    if (isFav) {
      setFavorites((prev) => prev.filter((f) => f.word.toLowerCase() !== wordItem.word.toLowerCase()));
    } else {
      setFavorites((prev) => [{ word: wordItem.word, phonetic: wordItem.phonetic }, ...prev]);
    }
  };

  // Handler: Shuffle Word of the Day
  const handleShuffleWotd = () => {
    stopSpeech();
    setActiveSpeakingId(null);
    const nextIdx = (wotdIndex + 1) % WORDS_OF_THE_DAY.length;
    setWotdIndex(nextIdx);
    const shuffledItem = WORDS_OF_THE_DAY[nextIdx];
    const todayDate = new Date();
    setWordOfTheDay({
      ...shuffledItem,
      date: "Featured Pick",
      formattedDate: todayDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })
    });
  };

  const isCurrentFavorite = currentWordData
    ? favorites.some((f) => f.word.toLowerCase() === currentWordData.word.toLowerCase())
    : false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* 1. Header with Dark/Light Theme Option & Controls */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        autoSpeak={autoSpeak}
        onToggleAutoSpeak={() => setAutoSpeak((prev) => !prev)}
        onOpenHistory={() => setIsModalOpen(true)}
        historyCount={history.length}
        favoritesCount={favorites.length}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col items-center">
        {/* Welcome Tagline */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-semibold border border-brand-200/60 dark:border-brand-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Voice-Powered Vocabulary Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Speak a Word. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Discover Its Meaning.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Pronounce, look up, and practice speaking any word with natural speech recognition and spoken voice responses.
          </p>

          {/* Speech Synthesis status indicator if active */}
          {isPlayingDefinition && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800 animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Speaking response aloud... Click any speaker button to pause</span>
            </div>
          )}
        </div>

        {/* 2. Prominent Central Microphone Button with "Listening..." state & error handling */}
        <VoiceMicButton
          isListening={isListening}
          isLoading={isLoading}
          transcript={liveTranscript}
          onToggleListening={handleToggleListening}
          errorMessage={voiceError}
          isBlocked={isVoiceBlocked}
          isSupported={isSpeechRecognitionSupported()}
          onFallbackToTyping={handleFallbackToTyping}
        />

        {/* 3. Text Input Box (Fallback Option with programmatic focus support) */}
        <SearchBar
          inputRef={searchInputRef}
          onSearch={handleSearchWord}
          isLoading={isLoading}
        />

        {/* Error Notification if Word Not Found */}
        {searchError && (
          <div className="w-full max-w-2xl mx-auto mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Lookup notice</p>
              <p className="mt-0.5 text-xs sm:text-sm text-amber-700 dark:text-amber-300">{searchError}</p>
            </div>
          </div>
        )}

        {/* 4. Clean Display Card Area with Practice Speaking Button */}
        {currentWordData && (
          <WordCard
            data={currentWordData}
            isPlayingAudio={isPlayingAudio}
            isPlayingDefinition={isPlayingDefinition}
            activeSpeakingId={activeSpeakingId}
            onPlayPronunciation={handlePlayPronunciation}
            onPlayDefinition={handlePlayFullDefinition}
            onSpeakText={handleSpeakSpecificText}
            onOpenPractice={handleOpenPractice}
            isFavorite={isCurrentFavorite}
            onToggleFavorite={handleToggleFavorite}
            onSearchWord={handleSearchWord}
          />
        )}

        {/* 5. "Word of the Day" Section (Requirement 3: Daily rotating word based on current date) */}
        <WordOfTheDay
          wordData={wordOfTheDay}
          onExplore={handleSearchWord}
          onShuffle={handleShuffleWotd}
          onPlayPronunciation={handlePlayPronunciation}
          onSpeakText={handleSpeakSpecificText}
          onOpenPractice={handleOpenPractice}
          activeSpeakingId={activeSpeakingId}
          isPlayingAudio={isPlayingAudio}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>VoxLex Vocabulary Voice Assistant &bull; Native SpeechSynthesis & SpeechRecognition Web APIs</p>
      </footer>

      {/* History and Bookmarks Drawer / Modal */}
      <HistoryFavoritesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        history={history}
        favorites={favorites}
        onSelectWord={handleSearchWord}
        onClearHistory={() => setHistory([])}
        onRemoveFavorite={(w) => setFavorites((prev) => prev.filter((f) => f.word !== w))}
        onPlayWord={handlePlayPronunciation}
      />

      {/* Requirement 2: Pronunciation Practice Modal */}
      <PronunciationPracticeModal
        isOpen={isPracticeModalOpen}
        onClose={handleClosePractice}
        targetWord={practiceTarget?.word}
        phonetic={practiceTarget?.phonetic}
        audioUrl={practiceTarget?.audioUrl}
        onPlayPronunciation={handlePlayPronunciation}
      />
    </div>
  );
}
