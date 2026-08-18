import React, { useState } from 'react';
import { Search, Play, AlertTriangle, Compass } from 'lucide-react';
import { ReelItem } from '../types';

interface CatalogueFeedProps {
  reels: ReelItem[];
  activeReelId: string;
  onSelectReel: (reel: ReelItem) => void;
  isLoading: boolean;
}

export const CatalogueFeed: React.FC<CatalogueFeedProps> = ({
  reels,
  activeReelId,
  onSelectReel,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(reels.map((r) => r.category)))];

  const filteredReels = reels.filter((reel) => {
    const matchesCategory = selectedCategory === 'All' || reel.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      reel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reel.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reel.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reel.hashtags.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section 
      aria-labelledby="feed-heading"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
    >
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h3 id="feed-heading" className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>Social Media Tech Reel Feed ({reels.length} Items)</span>
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Select any Reel below to instantly run latent technical extraction and recommendation
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <label htmlFor="feed-search-input" className="sr-only">Search reels by topic or keyword</label>
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            id="feed-search-input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search topics, keywords..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div 
        role="toolbar" 
        aria-label="Filter reels by category"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            aria-pressed={selectedCategory === cat}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed Cards Grid */}
      <div 
        role="region" 
        aria-label="Reels list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1"
      >
        {filteredReels.map((reel) => {
          const isActive = reel.id === activeReelId;

          return (
            <button
              key={reel.id}
              type="button"
              onClick={() => onSelectReel(reel)}
              disabled={isLoading}
              aria-label={`Select reel: ${reel.title} by ${reel.author}. Category: ${reel.category}. Difficulty: ${reel.difficulty}.`}
              aria-current={isActive ? 'true' : undefined}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                isActive
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-md'
                  : 'bg-stone-50/60 dark:bg-stone-950/70 border-stone-200 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-100/80 dark:hover:bg-stone-950'
              }`}
            >
              {/* Active Indicator bar */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" aria-hidden="true" />
              )}

              {/* Card Header */}
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 truncate max-w-[150px]">
                    {reel.category}
                  </span>

                  {reel.isHypeOrClickbait ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" aria-hidden="true" />
                      <span>Hype Sample</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-stone-600 dark:text-stone-400">
                      {reel.difficulty}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors leading-snug">
                  {reel.title}
                </h4>

                <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                  {reel.caption}
                </p>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800/60 text-[11px] text-stone-500 dark:text-stone-400 w-full">
                <span className="truncate max-w-[120px] font-medium text-stone-700 dark:text-stone-300">
                  {reel.author}
                </span>

                <div
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 group-hover:bg-indigo-600 group-hover:text-white'
                  }`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
                  <span>{isActive ? 'Active' : 'Analyze'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
