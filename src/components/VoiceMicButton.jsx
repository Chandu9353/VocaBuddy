import React from 'react';
import { Mic, MicOff, Square, Loader2, Sparkles, AlertCircle, Keyboard, ShieldAlert } from 'lucide-react';
import AudioWaveVisualizer from './AudioWaveVisualizer';

export default function VoiceMicButton({
  isListening,
  isLoading,
  transcript,
  onToggleListening,
  errorMessage,
  isBlocked = false,
  isSupported = true,
  onFallbackToTyping
}) {
  return (
    <div className="flex flex-col items-center justify-center my-6 sm:my-8">
      {/* Central Interactive Voice Hub */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Concentric Aura Waves when Listening */}
        {isListening && (
          <>
            <span className="absolute w-36 h-36 rounded-full bg-rose-500/20 dark:bg-rose-400/20 animate-ping" />
            <span className="absolute w-44 h-44 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 animate-pulse" />
            <span className="absolute w-52 h-52 rounded-full border-2 border-emerald-500/30 dark:border-emerald-400/30 animate-ping-slow" />
          </>
        )}

        {/* Ambient Subtle Glow when Idle */}
        {!isListening && (
          <span className="absolute -inset-2 rounded-full bg-gradient-to-r from-brand-500 to-purple-600 opacity-20 blur-xl group-hover:opacity-40 transition duration-500"></span>
        )}

        {/* Requirement 1: Prominent Microphone button that toggles listening state */}
        <button
          onClick={onToggleListening}
          disabled={!isSupported || isLoading}
          aria-label={isListening ? "Listening... click to stop" : "Start voice search"}
          className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 ${
            !isSupported
              ? "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
              : isLoading
              ? "bg-amber-500 text-white cursor-wait shadow-amber-500/30 animate-pulse"
              : isListening
              ? "bg-gradient-to-tr from-rose-600 via-pink-600 to-red-500 text-white shadow-rose-500/50 scale-105 ring-4 ring-rose-400/50"
              : "bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-500 hover:via-indigo-500 hover:to-violet-500 text-white shadow-brand-500/30 hover:scale-105 hover:shadow-brand-500/50 active:scale-95 focus:ring-brand-500/40"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin" />
          ) : isListening ? (
            <div className="flex flex-col items-center">
              <Square className="w-8 h-8 sm:w-9 sm:h-9 fill-white animate-pulse" />
              {/* Requirement 1: UI State changes to "Listening..." */}
              <span className="text-[10px] font-bold tracking-wider uppercase mt-1 animate-pulse">
                Listening...
              </span>
            </div>
          ) : !isSupported ? (
            <div className="flex flex-col items-center">
              <MicOff className="w-9 h-9 sm:w-11 sm:h-11" />
              <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Off</span>
            </div>
          ) : (
            <div className="flex flex-col items-center group">
              <Mic className="w-9 h-9 sm:w-11 sm:h-11 transition-transform group-hover:scale-110" />
              <span className="text-[10px] font-bold tracking-wider uppercase mt-1 opacity-90">Tap to Speak</span>
            </div>
          )}
        </button>
      </div>

      {/* Requirement 1: UI State display when Listening */}
      {isListening && (
        <div className="mt-4 flex flex-col items-center gap-1.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs font-bold tracking-wide">Listening...</span>
            <AudioWaveVisualizer active={true} color="bg-rose-500 dark:bg-rose-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Say e.g. <span className="font-semibold text-rose-600 dark:text-rose-400">"What does the word 'Resilient' mean?"</span>
          </p>
        </div>
      )}

      {/* Requirement 2: Capture and show spoken transcript live */}
      {isListening && transcript && (
        <div className="mt-3 px-4 py-2.5 max-w-lg mx-auto rounded-2xl bg-white/95 dark:bg-slate-800/95 shadow-lg border border-rose-200 dark:border-rose-900/60 flex items-center gap-2.5 animate-bounce-subtle">
          <Sparkles className="w-4 h-4 text-rose-500 shrink-0 animate-spin" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 block">
              Hearing your voice:
            </span>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 italic truncate">
              "{transcript}"
            </p>
          </div>
        </div>
      )}

      {/* State Cue / Instructions when Idle */}
      {!isListening && !isLoading && !errorMessage && (
        <div className="mt-3 text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isSupported ? "Tap microphone and speak your query" : "Voice input is not supported in this browser"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Try: <span className="text-brand-600 dark:text-brand-400 font-medium">"What does the word 'Resilient' mean?"</span> or <span className="text-brand-600 dark:text-brand-400 font-medium">"Define serendipity"</span>
          </p>
        </div>
      )}

      {/* Requirement 4: Handle browser permissions gracefully with clear error messages & fallback to manual typing */}
      {errorMessage && (
        <div className="mt-4 w-full max-w-md mx-auto p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 shadow-sm animate-in fade-in flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            {isBlocked ? (
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs leading-relaxed">
              <p className="font-bold text-amber-800 dark:text-amber-300">
                {isBlocked ? "Microphone Permission Blocked" : "Voice Input Notice"}
              </p>
              <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                {errorMessage}
              </p>
            </div>
          </div>

          {/* Action button to smoothly fall back to manual typing */}
          {onFallbackToTyping && (
            <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60 flex items-center justify-between">
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                Prefer to type?
              </span>
              <button
                type="button"
                onClick={onFallbackToTyping}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Type Word Manually</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
