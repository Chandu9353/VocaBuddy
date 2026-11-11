import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  Mic,
  Square,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Award,
  ThumbsUp
} from 'lucide-react';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speechRecognition';
import { evaluatePronunciation } from '../utils/pronunciationMatcher';
import AudioWaveVisualizer from './AudioWaveVisualizer';

export default function PronunciationPracticeModal({
  isOpen,
  onClose,
  targetWord,
  phonetic,
  audioUrl,
  onPlayPronunciation
}) {
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const recognizerRef = useRef(null);

  // Abort speech recognizer on unmount
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
    };
  }, []);

  if (!isOpen || !targetWord) return null;

  const handleClose = () => {
    if (recognizerRef.current) {
      recognizerRef.current.abort();
    }
    setIsListening(false);
    setSpokenTranscript('');
    setEvaluation(null);
    setErrorMessage('');
    onClose();
  };

  const handleStartSpeaking = () => {
    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setErrorMessage("Speech recognition is not supported in this browser. Please use a Chromium browser like Google Chrome or Microsoft Edge.");
      return;
    }

    setErrorMessage('');
    setEvaluation(null);
    setSpokenTranscript('');

    const recognizer = createSpeechRecognizer({
      onStart: () => {
        setIsListening(true);
        setErrorMessage('');
      },
      onInterimResult: (transcript) => {
        setSpokenTranscript(transcript);
      },
      onFinalResult: (transcript) => {
        setIsListening(false);
        setSpokenTranscript(transcript);
        const result = evaluatePronunciation(transcript, targetWord);
        setEvaluation(result);
      },
      onError: ({ message }) => {
        setIsListening(false);
        setErrorMessage(message);
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
        setErrorMessage("Could not start microphone. Please check browser permissions.");
        setIsListening(false);
      }
    }
  };

  const handleTryAgain = () => {
    setEvaluation(null);
    setSpokenTranscript('');
    setErrorMessage('');
    handleStartSpeaking();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col p-6 sm:p-7 relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close practice mode"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Practice Speaking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive pronunciation practice & feedback
            </p>
          </div>
        </div>

        {/* Word Display Area */}
        <div className="text-center py-4 px-4 my-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <h2 className="text-3xl sm:text-4xl font-extrabold capitalize text-slate-900 dark:text-white tracking-tight">
            {targetWord}
          </h2>
          {phonetic && (
            <p className="font-mono text-sm text-brand-600 dark:text-brand-400 mt-1 font-medium">
              {phonetic}
            </p>
          )}

          {/* Guide Audio Button */}
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => onPlayPronunciation({ audioUrl, word: targetWord })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700/80 hover:bg-brand-50 dark:hover:bg-brand-950/50 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold shadow-sm transition-all"
            >
              <Volume2 className="w-3.5 h-3.5 text-brand-500" />
              <span>Hear Audio Guide</span>
            </button>
          </div>
        </div>

        {/* Central Interactive Voice Recording Action */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <span className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping" />
                <span className="absolute w-36 h-36 rounded-full bg-emerald-500/20 animate-pulse" />
              </>
            )}

            <button
              onClick={handleStartSpeaking}
              disabled={!isSpeechRecognitionSupported()}
              className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
                isListening
                  ? "bg-emerald-600 text-white ring-4 ring-emerald-400/50 scale-105"
                  : "bg-gradient-to-tr from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white hover:scale-105 shadow-brand-500/30"
              }`}
            >
              {isListening ? (
                <>
                  <Square className="w-6 h-6 fill-white animate-pulse" />
                  <span className="text-[9px] font-bold uppercase mt-0.5">Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-7 h-7" />
                  <span className="text-[9px] font-bold uppercase mt-0.5">Speak</span>
                </>
              )}
            </button>
          </div>

          {/* Listening Indicator */}
          {isListening && (
            <div className="mt-3 flex flex-col items-center gap-1">
              <AudioWaveVisualizer active={true} color="bg-emerald-500" />
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                Listening... Say "{targetWord}" now!
              </p>
            </div>
          )}

          {!isListening && !evaluation && !errorMessage && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
              Click the microphone and say the word out loud
            </p>
          )}

          {/* Real-time transcript bubble */}
          {isListening && spokenTranscript && (
            <div className="mt-2 text-xs italic text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              "{spokenTranscript}"
            </div>
          )}
        </div>

        {/* Visual Feedback Card */}
        {evaluation && (
          <div
            className={`mt-2 p-4 rounded-2xl border transition-all animate-in zoom-in-95 duration-200 ${evaluation.cardColor}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {evaluation.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : evaluation.status === 'close' ? (
                  <ThumbsUp className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-sm">{evaluation.title}</h4>
                  <span className="text-[10px] font-semibold opacity-75">
                    Match Accuracy: {evaluation.percentage}%
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${evaluation.badgeColor}`}>
                {evaluation.status === 'success' ? 'Perfect' : evaluation.status === 'close' ? 'Close' : 'Needs Practice'}
              </span>
            </div>

            <p className="text-xs mt-2 leading-relaxed opacity-90">
              {evaluation.feedback}
            </p>

            {spokenTranscript && (
              <p className="text-[11px] mt-1.5 opacity-80">
                You spoke: <strong className="font-semibold italic">"{spokenTranscript}"</strong>
              </p>
            )}

            {/* Action buttons inside feedback card */}
            <div className="mt-3 pt-3 border-t border-current/15 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleTryAgain}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white text-xs font-semibold shadow-sm transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-semibold hover:underline opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-2 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
