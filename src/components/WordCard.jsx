import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Quote,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import AudioWaveVisualizer from './AudioWaveVisualizer';

export default function WordCard({
  data,
  isPlayingAudio,
  isPlayingDefinition,
  activeSpeakingId,
  onPlayPronunciation,
  onPlayDefinition,
  onSpeakText,
  onOpenPractice,
  isFavorite,
  onToggleFavorite,
  onSearchWord,
}) {
  const [copied, setCopied] = useState(false);
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState('all');

  if (!data) return null;

  const {
    word,
    phonetic,
    audioUrl,
    meanings = [],
    allSynonyms = [],
    allAntonyms = [],
    sourceUrls = []
  } = data;

  // Extract unique parts of speech
  const partsOfSpeech = Array.from(new Set(meanings.map((m) => m.partOfSpeech)));

  // Filter meanings based on selected part of speech tab
  const filteredMeanings = selectedPartOfSpeech === 'all'
    ? meanings
    : meanings.filter((m) => m.partOfSpeech === selectedPartOfSpeech);

  const handleCopy = () => {
    const firstDef = meanings[0]?.definitions[0]?.definition || '';
    const textToCopy = `${word} (${phonetic || ''})\n${firstDef}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="w-full max-w-3xl mx-auto mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 transition-all duration-300">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight capitalize">
              {word}
            </h2>

            {phonetic && (
              <span className="font-mono text-sm sm:text-base px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-medium">
                {phonetic}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>English Dictionary Entry</span>
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          {/* Audio Speaker Pronunciation Button */}
          <button
            onClick={() => onPlayPronunciation({ audioUrl, word })}
            disabled={isPlayingAudio}
            title="Listen to word pronunciation"
            className={`p-3 rounded-2xl flex items-center gap-2 font-medium text-sm transition-all duration-200 shadow-sm ${
              isPlayingAudio
                ? "bg-brand-600 text-white ring-4 ring-brand-500/30"
                : "bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span className="text-xs font-semibold">Playing...</span>
                <AudioWaveVisualizer active={true} color="bg-white" />
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-semibold">Pronounce</span>
              </>
            )}
          </button>

          {/* Voice Assistant Definition Readout Button */}
          <button
            onClick={onPlayDefinition}
            disabled={isPlayingDefinition && activeSpeakingId !== 'full-def'}
            title="Voice Assistant reads the full definition and example"
            className={`p-3 rounded-2xl flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 ${
              isPlayingDefinition && activeSpeakingId === 'full-def'
                ? "bg-purple-600 text-white ring-4 ring-purple-500/30"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span className="hidden md:inline">
              {isPlayingDefinition && activeSpeakingId === 'full-def' ? "Speaking..." : "Read Aloud"}
            </span>
          </button>

          {/* Requirement 2: Practice Speaking Feature Button */}
          {onOpenPractice && (
            <button
              onClick={() => onOpenPractice({ word, phonetic, audioUrl })}
              title="Practice speaking this word with speech recognition and instant feedback"
              className="p-3 rounded-2xl flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all shadow-sm"
            >
              <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Practice Speaking</span>
            </button>
          )}

          {/* Bookmark / Favorite Button */}
          <button
            onClick={() => onToggleFavorite(data)}
            title={isFavorite ? "Remove from saved words" : "Save to vocabulary list"}
            className={`p-3 rounded-2xl border transition-colors ${
              isFavorite
                ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-400"
                : "border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {isFavorite ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy definition"
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Part of Speech Filter Tabs */}
      {partsOfSpeech.length > 1 && (
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
            Filter:
          </span>
          <button
            onClick={() => setSelectedPartOfSpeech('all')}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
              selectedPartOfSpeech === 'all'
                ? "bg-brand-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Parts ({meanings.length})
          </button>
          {partsOfSpeech.map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPartOfSpeech(pos)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium italic transition-colors ${
                selectedPartOfSpeech === pos
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      )}

      {/* Meanings & Definitions List */}
      <div className="mt-6 space-y-6">
        {filteredMeanings.map((meaning, mIdx) => (
          <div key={mIdx} className="space-y-4">
            {/* Part of speech pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                {meaning.partOfSpeech}
              </span>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Definitions */}
            <ol className="space-y-4 pl-1">
              {meaning.definitions.map((defObj, dIdx) => {
                const defId = `def-${mIdx}-${dIdx}`;
                const exId = `ex-${mIdx}-${dIdx}`;
                const isDefSpeaking = activeSpeakingId === defId;
                const isExSpeaking = activeSpeakingId === exId;

                return (
                  <li key={dIdx} className="group flex gap-3 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                    <span className="text-brand-600 dark:text-brand-400 font-bold shrink-0 text-sm mt-0.5">
                      {dIdx + 1}.
                    </span>
                    <div className="space-y-2 flex-1">
                      {/* Definition text + Manual Listen button */}
                      <div className="flex items-start justify-between gap-3">
                        <p className="leading-relaxed flex-1">
                          {defObj.definition}
                        </p>

                        <button
                          type="button"
                          onClick={() => onSpeakText(defObj.definition, defId)}
                          title={isDefSpeaking ? "Stop listening" : "Listen to definition"}
                          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                            isDefSpeaking
                              ? "bg-brand-600 text-white ring-2 ring-brand-400/50 shadow-sm"
                              : "bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-700 dark:bg-slate-800 dark:hover:bg-brand-950/60 dark:text-slate-300 dark:hover:text-brand-300"
                          }`}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isDefSpeaking ? "animate-pulse" : ""}`} />
                          <span>{isDefSpeaking ? "Playing" : "Listen"}</span>
                        </button>
                      </div>

                      {/* Example Sentence Highlight + Manual Listen button */}
                      {defObj.example && (
                        <div className="flex items-start justify-between gap-3 pl-3.5 pr-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-2 border-brand-500 text-slate-600 dark:text-slate-400 text-xs sm:text-sm italic">
                          <div className="flex-1">
                            <Quote className="w-3 h-3 text-brand-400 inline-block mr-1 -mt-1 opacity-70" />
                            "{defObj.example}"
                          </div>

                          <button
                            type="button"
                            onClick={() => onSpeakText(defObj.example, exId)}
                            title={isExSpeaking ? "Stop listening" : "Listen to example sentence"}
                            className={`shrink-0 not-italic inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                              isExSpeaking
                                ? "bg-brand-600 text-white ring-2 ring-brand-400/50 shadow-sm"
                              : "bg-white dark:bg-slate-700/70 hover:bg-brand-50 text-slate-600 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300"
                            }`}
                          >
                            <Volume2 className={`w-3 h-3 ${isExSpeaking ? "animate-pulse" : ""}`} />
                            <span className="text-[11px]">{isExSpeaking ? "Playing" : "Listen"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>

      {/* Synonyms & Antonyms Section */}
      {(allSynonyms.length > 0 || allAntonyms.length > 0) && (
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {allSynonyms.length > 0 && (
            <div className="flex items-start gap-2 flex-wrap text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Synonyms:
              </span>
              <div className="flex items-center flex-wrap gap-1.5">
                {allSynonyms.map((syn) => (
                  <button
                    key={syn}
                    onClick={() => onSearchWord(syn)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 font-medium transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{syn}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {allAntonyms.length > 0 && (
            <div className="flex items-start gap-2 flex-wrap text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Antonyms:
              </span>
              <div className="flex items-center flex-wrap gap-1.5">
                {allAntonyms.map((ant) => (
                  <button
                    key={ant}
                    onClick={() => onSearchWord(ant)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 font-medium transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{ant}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Source Link */}
      {sourceUrls.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>Source: Wiktionary Free Dictionary</span>
          <a
            href={sourceUrls[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 underline"
          >
            <span>View source page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </article>
  );
}
