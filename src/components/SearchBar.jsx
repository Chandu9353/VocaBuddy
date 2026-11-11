import React, { useState } from 'react';
import { Search, X, ArrowRight, Keyboard } from 'lucide-react';

const SUGGESTIONS = [
  'Resilient',
  'Serendipity',
  'Ephemeral',
  'Petrichor',
  'Mellifluous',
  'Sonder'
];

export default function SearchBar({
  onSearch,
  isLoading,
  inputRef
}) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSearch(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionClick = (word) => {
    setInputValue(word);
    onSearch(word);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center group">
        <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Manual fallback: Type any word here... (e.g., resilient, sonder)"
          disabled={isLoading}
          id="search-input"
          aria-label="Search dictionary word"
          className="w-full pl-11 pr-24 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base shadow-sm hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 font-medium text-xs sm:text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          >
            <span className="hidden sm:inline mr-1">Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggested Quick Chips */}
      <div className="mt-3 flex items-center justify-center flex-wrap gap-1.5 sm:gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Keyboard className="w-3 h-3 opacity-60" />
          <span>Quick picks:</span>
        </span>
        {SUGGESTIONS.map((word) => (
          <button
            key={word}
            type="button"
            onClick={() => handleSuggestionClick(word)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
