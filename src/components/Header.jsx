import React from 'react';
import { Sun, Moon, Volume2, VolumeX, History, Sparkles } from 'lucide-react';

export default function Header({
  isDark,
  onToggleTheme,
  autoSpeak,
  onToggleAutoSpeak,
  onOpenHistory,
  historyCount = 0,
  favoritesCount = 0,
}) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-500 dark:from-brand-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                VoxLex
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 dark:border dark:border-brand-800">
                Voice Assistant
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Intelligent Vocabulary Companion
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auto-Speak Toggle */}
          <button
            onClick={onToggleAutoSpeak}
            title={autoSpeak ? "Auto-speak definitions: ON" : "Auto-speak definitions: OFF"}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              autoSpeak
                ? "bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4 text-brand-600 dark:text-brand-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">Voice Answers</span>
          </button>

          {/* History & Favorites Trigger */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative flex items-center gap-1 text-xs font-medium"
            title="Search history and saved words"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
            {(historyCount > 0 || favoritesCount > 0) && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-brand-600 rounded-full">
                {favoritesCount + historyCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

