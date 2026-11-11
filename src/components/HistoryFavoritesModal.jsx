import React, { useState } from 'react';
import { X, History, Bookmark, Trash2, ArrowRight, Volume2 } from 'lucide-react';

export default function HistoryFavoritesModal({
  isOpen,
  onClose,
  history = [],
  favorites = [],
  onSelectWord,
  onClearHistory,
  onRemoveFavorite,
  onPlayWord
}) {
  const [activeTab, setActiveTab] = useState('history');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'history'
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Recent Searches ({history.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'favorites'
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks ({favorites.length})</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2">
          {activeTab === 'history' && (
            <>
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent searches yet.</p>
                  <p className="text-xs mt-1">Words you search via voice or text will appear here.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {history.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all cursor-pointer"
                      onClick={() => {
                        onSelectWord(item.word);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize text-sm">
                            {item.word}
                          </p>
                          {item.phonetic && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {item.phonetic}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayWord({ word: item.word });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                          title="Pronounce"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              {favorites.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No saved bookmarks yet.</p>
                  <p className="text-xs mt-1">Tap the bookmark icon on any word to save it for study.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {favorites.map((fav, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all cursor-pointer"
                      onClick={() => {
                        onSelectWord(fav.word);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize text-sm">
                            {fav.word}
                          </p>
                          {fav.phonetic && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {fav.phonetic}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFavorite(fav.word);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'history' && history.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500">
              {history.length} {history.length === 1 ? 'word' : 'words'} searched
            </span>
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

