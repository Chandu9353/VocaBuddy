import React from 'react';
import { Sparkles, Calendar, Volume2, ArrowRight, Shuffle, Lightbulb, BookOpen, Quote, Mic } from 'lucide-react';
import AudioWaveVisualizer from './AudioWaveVisualizer';

export default function WordOfTheDay({
  wordData,
  onExplore,
  onShuffle,
  onPlayPronunciation,
  onSpeakText,
  onOpenPractice,
  activeSpeakingId,
  isPlayingAudio
}) {
  if (!wordData) return null;

  const {
    word,
    phonetic,
    partOfSpeech,
    definition,
    example,
    etymology,
    formattedDate
  } = wordData;

  const isWotdDefSpeaking = activeSpeakingId === 'wotd-def';
  const isWotdExSpeaking = activeSpeakingId === 'wotd-ex';

  return (
    <section className="w-full max-w-3xl mx-auto mt-6 bg-gradient-to-br from-amber-500/10 via-brand-500/5 to-purple-500/10 dark:from-amber-950/30 dark:via-slate-900/40 dark:to-purple-950/30 rounded-3xl border border-amber-200/80 dark:border-amber-900/50 p-6 sm:p-7 shadow-sm transition-all duration-300">
      {/* Top Banner Row */}
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-amber-200/60 dark:border-amber-900/40 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm shadow-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Word of the Day
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>{formattedDate || "Today's Discovery"}</span>
          </span>
        </div>

        {/* Shuffle Button */}
        <button
          onClick={onShuffle}
          className="text-xs font-medium px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          title="Discover another curated word"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="mt-4 flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="space-y-3.5 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white capitalize">
              {word}
            </h3>

            {phonetic && (
              <span className="font-mono text-sm px-2.5 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/80 text-amber-700 dark:text-amber-300 font-medium border border-amber-200/50 dark:border-amber-900/50">
                {phonetic}
              </span>
            )}

            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 uppercase tracking-wide">
              {partOfSpeech}
            </span>

            {/* Pronunciation Speaker Button */}
            <button
              onClick={() => onPlayPronunciation({ word })}
              disabled={isPlayingAudio}
              className="p-1.5 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
              title="Hear word pronunciation"
            >
              {isPlayingAudio ? (
                <AudioWaveVisualizer active={true} color="bg-amber-500" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Definition with manual Listen button */}
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed flex-1">
              {definition}
            </p>
            {onSpeakText && (
              <button
                type="button"
                onClick={() => onSpeakText(definition, 'wotd-def')}
                title={isWotdDefSpeaking ? "Stop listening" : "Listen to definition"}
                className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                  isWotdDefSpeaking
                    ? "bg-amber-600 text-white ring-2 ring-amber-400/50 shadow-sm"
                    : "bg-white/80 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-200 hover:text-amber-800 dark:hover:text-amber-300"
                }`}
              >
                <Volume2 className={`w-3.5 h-3.5 ${isWotdDefSpeaking ? "animate-pulse" : ""}`} />
                <span>{isWotdDefSpeaking ? "Playing" : "Listen"}</span>
              </button>
            )}
          </div>

          {/* Example Sentence with manual Listen button */}
          {example && (
            <div className="flex items-start justify-between gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic pl-3 pr-2 py-1.5 border-l-2 border-amber-500/70 bg-amber-500/5 rounded-r-xl">
              <div className="flex-1">
                <Quote className="w-3 h-3 text-amber-500 inline-block mr-1 -mt-0.5 opacity-70" />
                "{example}"
              </div>
              {onSpeakText && (
                <button
                  type="button"
                  onClick={() => onSpeakText(example, 'wotd-ex')}
                  title={isWotdExSpeaking ? "Stop listening" : "Listen to example sentence"}
                  className={`shrink-0 not-italic inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                    isWotdExSpeaking
                      ? "bg-amber-600 text-white ring-2 ring-amber-400/50 shadow-sm"
                      : "bg-white/80 dark:bg-slate-800/80 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-600 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300"
                  }`}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isWotdExSpeaking ? "animate-pulse" : ""}`} />
                  <span className="text-[11px]">{isWotdExSpeaking ? "Playing" : "Listen"}</span>
                </button>
              )}
            </div>
          )}

          {/* Etymology / Did You Know note */}
          {etymology && (
            <div className="pt-1 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-700 dark:text-slate-300 font-semibold">Origin:</strong> {etymology}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons Column */}
        <div className="shrink-0 self-start md:self-center flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
          {/* Practice Speaking Button */}
          {onOpenPractice && (
            <button
              onClick={() => onOpenPractice({ word, phonetic, audioUrl: '' })}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>Practice Speaking</span>
            </button>
          )}

          {/* Full Analysis Button */}
          <button
            onClick={() => onExplore(word)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-1.5 transition-all group"
          >
            <BookOpen className="w-4 h-4" />
            <span>Full Analysis</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
