import React from 'react';
import { Sparkles, Brain, Compass, ArrowRight, Play, Code, ShieldCheck, HelpCircle } from 'lucide-react';
import { RecommendationResult, ReelItem } from '../types';

interface CompactRecommendationSummaryCardProps {
  result: RecommendationResult;
  onSelectRecommendedReel: (reelId: string) => void;
  onOpenJsonInspector: () => void;
  reelsCatalog: ReelItem[];
  isLoading: boolean;
}

export const CompactRecommendationSummaryCard: React.FC<CompactRecommendationSummaryCardProps> = ({
  result,
  onSelectRecommendedReel,
  onOpenJsonInspector,
  isLoading,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Deep Dive':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'Advanced':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'Intermediate':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
    }
  };

  const isLowConfidence = result.confidence <= 30;
  const isModerateConfidence = result.confidence > 30 && result.confidence <= 60;

  return (
    <div className="bg-white dark:bg-stone-900 border-2 border-indigo-500/40 rounded-2xl shadow-xl p-5 transition-all relative overflow-hidden flex flex-col gap-4">
      {/* Top Banner with Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              AI Recommendation Output
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/60 rounded-md">
                8 Core Schema Fields
              </span>
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Complete deduction summary generated directly from video interaction
            </p>
          </div>
        </div>

        {/* Confidence, Difficulty & JSON quick action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenJsonInspector}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Inspect structured JSON"
          >
            <Code className="w-3.5 h-3.5 text-indigo-500" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Non-Technical Low Signal Banner */}
      {isLowConfidence && (
        <div className="bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 flex items-start gap-2.5 text-stone-800 dark:text-stone-200 text-xs">
          <HelpCircle className="w-4 h-4 text-stone-600 dark:text-stone-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-900 dark:text-stone-100">Non-Technical Content Detected:</span>{' '}
            The system honestly recognized this reel as general entertainment/lifestyle without forcing an arbitrary technical category. Confidence is calibrated low ({result.confidence}%), and domain weights remain steady.
          </div>
        </div>
      )}

      {/* Anti-Hype Notice Banner (if applied) */}
      {result.hypePenaltyApplied && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 rounded-xl px-3.5 py-2 flex items-start gap-2.5 text-amber-900 dark:text-amber-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-900 dark:text-amber-300">Anti-Hype Shield Active:</span>{' '}
            {result.hypePenaltyExplanation || 'Filtered out superficial claims in favor of verifiable technical deep dives.'}
          </div>
        </div>
      )}

      {/* The 8 Core Fields Grid in One Compact View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5">
        {/* Field 1: CURRENT REEL (Cols 1-6) */}
        <div className="lg:col-span-6 bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              1. Current Reel
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
              {result.currentReel.contentType || 'Video'}
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
              {result.currentReel.title}
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
              Topic: {result.currentReel.extractedTopic || 'Systems Analysis'}
            </p>
          </div>
        </div>

        {/* Field 2: INTEREST DETECTED (Cols 7-12) */}
        <div className={`lg:col-span-6 border rounded-xl p-3.5 flex flex-col justify-between gap-1.5 ${
          isLowConfidence 
            ? 'bg-stone-100/70 dark:bg-stone-900/60 border-stone-300 dark:border-stone-700' 
            : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              isLowConfidence ? 'text-stone-600 dark:text-stone-400' : 'text-indigo-700 dark:text-indigo-400'
            }`}>
              <Brain className="w-3 h-3" />
              2. Interest Detected
            </span>
            <span className={`text-[10px] font-semibold ${
              isLowConfidence ? 'text-stone-500 dark:text-stone-400' : 'text-indigo-600 dark:text-indigo-300'
            }`}>
              {isLowConfidence ? 'Zero/Low Signal' : 'Latent Signal'}
            </span>
          </div>
          <div>
            <h4 className={`text-xs font-bold leading-snug ${
              isLowConfidence ? 'text-stone-800 dark:text-stone-200' : 'text-indigo-950 dark:text-indigo-200'
            }`}>
              {result.interestDetected}
            </h4>
            <p className={`text-[11px] mt-0.5 line-clamp-1 ${
              isLowConfidence ? 'text-stone-500 dark:text-stone-400' : 'text-indigo-800/80 dark:text-indigo-300/80'
            }`}>
              {isLowConfidence ? 'Honest baseline evaluation (no category forced)' : 'Deduction: True technical curiosity inferred beyond surface wording'}
            </p>
          </div>
        </div>

        {/* Field 3: WHY (Full Width on 12 cols) */}
        <div className="lg:col-span-12 bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            3. Why (Latent Analytical Justification)
          </span>
          <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
            {result.why}
          </p>
        </div>

        {/* Field 4: RECOMMENDED TECH REEL (Cols 1-12) */}
        <div className="lg:col-span-12 bg-white dark:bg-stone-950 border-2 border-indigo-500/30 dark:border-indigo-500/40 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              4. Recommended Tech Reel
            </span>

            {/* Quick meta badges (Category, Difficulty, Confidence) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-stone-100 text-stone-800 border border-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700">
                5. Category: <strong>{result.category}</strong>
              </span>
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${getDifficultyBadge(result.difficulty)}`}>
                7. Difficulty: <strong>{result.difficulty}</strong>
              </span>
              <span className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded-md border ${
                isLowConfidence 
                  ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                  : isModerateConfidence
                  ? 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
              }`}>
                8. Confidence: <strong>{result.confidence}%</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {result.recommendedTechReel.title}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                {result.recommendedTechReel.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                <span>By {result.recommendedTechReel.author}</span>
                {result.recommendedTechReel.duration && (
                  <span>• {result.recommendedTechReel.duration}</span>
                )}
              </div>
            </div>

            {/* Watch Next CTA */}
            <div className="shrink-0">
              <button
                onClick={() => onSelectRecommendedReel(result.recommendedTechReel.id)}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch Recommended Reel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Field 6: WHY THIS RECOMMENDATION (Full Width on 12 cols) */}
        <div className="lg:col-span-12 bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            6. Why This Recommendation (Anti-Clickbait & Pedagogical Rationale)
          </span>
          <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
            {result.whyThisRecommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
