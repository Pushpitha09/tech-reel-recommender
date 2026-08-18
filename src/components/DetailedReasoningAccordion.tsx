import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, History, Activity, Brain } from 'lucide-react';
import { InterestProfileDashboard } from './InterestProfileDashboard';
import { SessionTimeline } from './SessionTimeline';
import { InterestDomain, RecommendationResult, SessionHistoryEntry } from '../types';

interface DetailedReasoningAccordionProps {
  result: RecommendationResult;
  profile: InterestDomain[];
  sessionHistory: SessionHistoryEntry[];
  onSelectHistoryEntry: (entry: SessionHistoryEntry) => void;
  selectedHistoryEntryId?: string;
}

export const DetailedReasoningAccordion: React.FC<DetailedReasoningAccordionProps> = ({
  result,
  profile,
  sessionHistory,
  onSelectHistoryEntry,
  selectedHistoryEntryId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-md transition-all overflow-hidden">
      {/* Toggle Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between bg-stone-50/70 dark:bg-stone-950/60 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors cursor-pointer text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              Detailed Reasoning & Technical Trace
              <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
                (Interest Profile, Deduction Steps & Interaction Trail)
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {isOpen ? 'Hide detailed reasoning' : 'Show detailed reasoning'}
          </span>
          <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Collapsible Content Body */}
      {isOpen && (
        <div className="p-5 flex flex-col gap-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-950/30 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* AI Recommender Deduction Path */}
          {result.reasoningSteps && result.reasoningSteps.length > 0 && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex flex-col gap-2.5 shadow-sm">
              <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                AI Deduction Path & Logical Flow
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-600 dark:text-stone-300">
                {result.reasoningSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-800"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side by side: Session Interest Profile + Interaction Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7">
              <InterestProfileDashboard
                profile={profile}
                totalReels={sessionHistory.length}
              />
            </div>
            <div className="lg:col-span-5">
              <SessionTimeline
                history={sessionHistory}
                onSelectHistoryEntry={onSelectHistoryEntry}
                selectedEntryId={selectedHistoryEntryId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
