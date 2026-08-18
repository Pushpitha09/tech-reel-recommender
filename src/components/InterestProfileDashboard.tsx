import React from 'react';
import { Activity, TrendingUp, Sparkles, Info } from 'lucide-react';
import { InterestDomain } from '../types';

interface InterestProfileDashboardProps {
  profile: InterestDomain[];
  totalReels: number;
}

export const InterestProfileDashboard: React.FC<InterestProfileDashboardProps> = ({
  profile,
  totalReels,
}) => {
  // Sort by score descending to highlight top interests
  const sortedDomains = [...profile].sort((a, b) => b.score - a.score);
  const topDomain = sortedDomains[0];

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Session Technical Interest Profile
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Multi-dimensional interest weights accumulated across {totalReels} reel{totalReels === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {topDomain && topDomain.score > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-500/30 dark:text-indigo-300 text-xs">
            <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>Leading:</span>
            <strong className="font-bold">{topDomain.label.split(' ')[0]}</strong>
          </div>
        )}
      </div>

      {/* Progress Bars for all domains */}
      <div className="flex flex-col gap-3">
        {profile.map((domain) => {
          const isTop = topDomain?.key === domain.key && domain.score > 20;

          return (
            <div key={domain.key} className="flex flex-col gap-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: domain.color }}
                  />
                  <span className={`font-medium transition-colors ${isTop ? 'text-stone-900 dark:text-stone-100 font-bold' : 'text-stone-700 dark:text-stone-300'}`}>
                    {domain.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  {domain.growth > 0 && (
                    <span className="flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-500/30">
                      <TrendingUp className="w-2.5 h-2.5" />
                      +{domain.growth}%
                    </span>
                  )}
                  <span className="text-stone-900 dark:text-stone-200 font-bold min-w-[28px] text-right">
                    {domain.score}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(100, Math.max(4, domain.score))}%`,
                    backgroundColor: domain.color,
                  }}
                />
              </div>

              {/* Description note */}
              <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
                {domain.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Info note */}
      <div className="mt-1 pt-3 border-t border-stone-200 dark:border-stone-800/60 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          Vectors update dynamically per interaction
        </span>
        <span className="font-mono">
          8 technical axes active
        </span>
      </div>
    </div>
  );
};
