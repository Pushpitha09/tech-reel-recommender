import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle, Brain, Gauge, Compass, Layers, Code, Play } from 'lucide-react';
import { RecommendationResult, ReelItem } from '../types';

interface RecommendationCardProps {
  result: RecommendationResult;
  onSelectRecommendedReel: (reelId: string) => void;
  onOpenJsonInspector: () => void;
  reelsCatalog: ReelItem[];
  isLoading: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  result,
  onSelectRecommendedReel,
  onOpenJsonInspector,
  reelsCatalog,
  isLoading,
}) => {
  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Deep Dive':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      case 'Advanced':
        return 'bg-blue-950/60 text-blue-300 border-blue-500/40';
      case 'Intermediate':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <section 
      aria-label="Recommendation Card"
      className="bg-stone-900 border-2 border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col gap-5"
    >
      {/* Subtle background glow */}
      <div className="absolute -right-24 -top-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Top Bar: Latent Deduction Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30"
            aria-hidden="true"
          >
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
              Latent Interest Extracted
            </span>
            <h3 className="text-sm font-bold text-stone-100">
              {result.interestDetected}
            </h3>
          </div>
        </div>

        {/* Confidence & Difficulty Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-950/80 border border-stone-800 text-xs font-mono text-stone-300">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Confidence: <strong className="text-emerald-400">{result.confidence}%</strong></span>
          </div>

          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getDifficultyBadgeColor(result.difficulty)}`}>
            {result.difficulty}
          </span>
        </div>
      </div>

      {/* Latent Deduction "WHY" Analysis */}
      <div className="bg-stone-950/70 border border-stone-800/80 rounded-xl p-3.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" aria-hidden="true" />
            <span>AI Analytical Deduction (Beyond Surface Keywords)</span>
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            Type: {result.currentReel.contentType || 'Technical Postmortem'}
          </span>
        </div>
        <p className="text-xs text-stone-200 leading-relaxed">
          {result.why}
        </p>
      </div>

      {/* Anti-Hype Shield Impact Notice */}
      {result.hypePenaltyApplied && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-amber-200 text-xs leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="font-semibold text-amber-300">Anti-Hype Shield Active:</strong>{' '}
            {result.hypePenaltyExplanation || 'Superficial buzzwords and get-rich-quick claims penalized in favor of verifiable engineering architecture.'}
          </div>
        </div>
      )}

      {/* Spotlight Recommended Tech Reel Section */}
      <div className="bg-stone-950/90 border border-indigo-500/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Recommended Tech Reel</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 text-[11px] font-medium text-indigo-300 border border-indigo-800/50">
            {result.category}
          </span>
        </div>

        <div>
          <h4 className="text-base font-bold text-stone-100 hover:text-indigo-300 transition-colors">
            {result.recommendedTechReel.title}
          </h4>
          <p className="mt-1 text-xs text-stone-300 leading-relaxed">
            {result.recommendedTechReel.excerpt}
          </p>
        </div>

        {/* Creator & Meta info */}
        <div className="flex items-center justify-between text-xs text-stone-400 border-t border-stone-800/80 pt-2.5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-300">{result.recommendedTechReel.author}</span>
            {result.recommendedTechReel.duration && (
              <span className="font-mono text-stone-400">• {result.recommendedTechReel.duration}</span>
            )}
          </div>
          {result.recommendedTechReel.hashtags && result.recommendedTechReel.hashtags.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-stone-400">
              {result.recommendedTechReel.hashtags.slice(0, 2).map((t, idx) => (
                <span key={idx}>{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Why this recommendation was selected */}
        <div className="rounded-lg bg-stone-900/90 p-3 border border-stone-800 text-xs flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" aria-hidden="true" />
            <span>Why This Recommendation</span>
          </span>
          <p className="text-xs text-stone-300 leading-relaxed">
            {result.whyThisRecommendation}
          </p>
        </div>

        {/* Action Button: Feed as next interaction */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelectRecommendedReel(result.recommendedTechReel.id)}
            disabled={isLoading}
            aria-label={`Watch ${result.recommendedTechReel.title} next and feed into session`}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
            <span>Watch This Reel Next (Feed into Session)</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onOpenJsonInspector}
            aria-label="Inspect structured JSON payload"
            className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Sequential Reasoning Chain Steps */}
      {result.reasoningSteps && result.reasoningSteps.length > 0 && (
        <div className="rounded-xl bg-stone-950/60 border border-stone-800/80 p-3 flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            <span>AI Recommender Deduction Path</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300">
            {result.reasoningSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-1.5 p-1.5 rounded-lg bg-stone-900/50 border border-stone-800/50">
                <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                  {idx + 1}
                </span>
                <span className="leading-tight text-stone-200">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
