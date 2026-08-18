import React from 'react';
import { Sparkles, ShieldCheck, RefreshCw, PlusCircle, Compass, Flame, Sun, Moon } from 'lucide-react';
import { InterestDomain } from '../types';

interface HeaderProps {
  totalAnalyzed: number;
  topDomain: InterestDomain | null;
  antiHypeStrictness: 'normal' | 'strict';
  onToggleStrictness: () => void;
  onOpenSubmitModal: () => void;
  onOpenDemoTrails: () => void;
  onResetSession: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalAnalyzed,
  topDomain,
  antiHypeStrictness,
  onToggleStrictness,
  onOpenSubmitModal,
  onOpenDemoTrails,
  onResetSession,
  theme,
  onToggleTheme,
  isLoading,
}) => {
  return (
    <header className="border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-gradient-to-br dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white shrink-0"
            aria-hidden="true"
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                Tech Reel Recommender
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 rounded-full">
                Gemini 3.7
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Latent technical interest extraction & anti-hype video recommendation engine
            </p>
          </div>
        </div>

        {/* Live Session Indicators & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} color scheme`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-800 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                <span>Dark Theme</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>Light Theme</span>
              </>
            )}
          </button>

          {/* Anti-Hype Shield status badge */}
          <button
            type="button"
            onClick={onToggleStrictness}
            aria-label={`Toggle Anti-Hype filter strictness, currently set to ${antiHypeStrictness}`}
            aria-pressed={antiHypeStrictness === 'strict'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              antiHypeStrictness === 'strict'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500/40 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                : 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-500/40 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Anti-Hype Shield: {antiHypeStrictness === 'strict' ? 'Strict' : 'Standard'}</span>
          </button>

          {/* Session Reels Counter */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300"
            aria-label={`Session progress: ${totalAnalyzed} reels analyzed`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" aria-hidden="true" />
            <span>Session: <strong className="text-stone-900 dark:text-stone-100">{totalAnalyzed}</strong> reels</span>
          </div>

          {/* Demo Trails Preset */}
          <button
            type="button"
            onClick={onOpenDemoTrails}
            disabled={isLoading}
            aria-label="Open curated demo interaction trails dialog"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-200 dark:border-stone-800 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>Demo Trails</span>
          </button>

          {/* Submit Custom Reel CTA */}
          <button
            type="button"
            onClick={onOpenSubmitModal}
            disabled={isLoading}
            aria-label="Open submit reel modal to input custom video title and transcript"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Submit Reel</span>
          </button>

          {/* Reset Session */}
          {totalAnalyzed > 0 && (
            <button
              type="button"
              onClick={onResetSession}
              disabled={isLoading}
              aria-label="Reset session history and technical interest profile"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="sr-only">Reset Session</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
