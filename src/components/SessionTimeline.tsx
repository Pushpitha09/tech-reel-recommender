import React from 'react';
import { History, Sparkles, ChevronRight } from 'lucide-react';
import { SessionHistoryEntry } from '../types';

interface SessionTimelineProps {
  history: SessionHistoryEntry[];
  onSelectHistoryEntry: (entry: SessionHistoryEntry) => void;
  selectedEntryId?: string;
}

export const SessionTimeline: React.FC<SessionTimelineProps> = ({
  history,
  onSelectHistoryEntry,
  selectedEntryId,
}) => {
  if (history.length === 0) {
    return (
      <section 
        aria-labelledby="history-heading"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center py-8"
      >
        <div 
          className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 mb-2"
          aria-hidden="true"
        >
          <History className="w-5 h-5" />
        </div>
        <h4 id="history-heading" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          No Watch History Yet
        </h4>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 max-w-xs mt-1">
          Select or submit any Reel to begin accumulating your session's latent technical interest profile.
        </p>
      </section>
    );
  }

  return (
    <section 
      aria-labelledby="history-heading"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center"
            aria-hidden="true"
          >
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 id="history-heading" className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Session Interaction Trail ({history.length})
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Chronological sequence of analyzed reels and inferred interests
            </p>
          </div>
        </div>
      </div>

      {/* History Items list */}
      <div 
        role="region"
        aria-label="History trail entries"
        className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1"
      >
        {history.map((entry, idx) => {
          const isSelected = selectedEntryId === entry.id;

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelectHistoryEntry(entry)}
              aria-current={isSelected ? 'true' : undefined}
              aria-label={`History step ${idx + 1}: Watched ${entry.reel.title}. Inferred: ${entry.result.interestDetected}. Recommended: ${entry.result.recommendedTechReel.title}`}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-500/60 shadow-sm'
                  : 'bg-stone-50/70 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-950'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] w-full">
                <div className="flex items-center gap-1.5 font-mono text-stone-600 dark:text-stone-400">
                  <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span>Watched:</span>
                  <strong className="text-stone-900 dark:text-stone-200 font-sans truncate max-w-[140px] sm:max-w-[190px]">
                    {entry.reel.title}
                  </strong>
                </div>

                <div className="flex items-center gap-1.5">
                  {entry.result.hypePenaltyApplied && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-[10px] font-mono font-medium">
                      Hype Filtered
                    </span>
                  )}
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Inferred Interest & Result */}
              <div className="flex items-center justify-between text-xs bg-white dark:bg-stone-900 rounded-lg p-2 border border-stone-200 dark:border-stone-800/80 w-full">
                <div className="flex items-center gap-1.5 truncate max-w-[78%]">
                  <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                  <span className="text-stone-500 dark:text-stone-400 truncate">Inferred:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                    {entry.result.interestDetected}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold shrink-0">
                  <span>Rec: {entry.result.recommendedTechReel.title.split(':')[0]}</span>
                  <ChevronRight className="w-3 h-3" aria-hidden="true" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
