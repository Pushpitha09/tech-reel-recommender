import React, { useState } from 'react';
import { Copy, Check, X, Terminal } from 'lucide-react';
import { RecommendationResult } from '../types';

interface StructuredJsonViewerProps {
  result: RecommendationResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StructuredJsonViewer: React.FC<StructuredJsonViewerProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'structured' | 'raw'>('structured');

  if (!isOpen || !result) return null;

  // Exact JSON payload according to user specifications
  const structuredOutput = {
    "CURRENT REEL": {
      id: result.currentReel.id,
      title: result.currentReel.title,
      contentType: result.currentReel.contentType,
      extractedTopic: result.currentReel.extractedTopic,
      underlyingInterest: result.currentReel.underlyingInterest,
      hypeScore: `${result.currentReel.hypeScore}/100`
    },
    "INTEREST DETECTED": result.interestDetected,
    "WHY": result.why,
    "RECOMMENDED TECH REEL": {
      id: result.recommendedTechReel.id,
      title: result.recommendedTechReel.title,
      category: result.recommendedTechReel.category,
      difficulty: result.recommendedTechReel.difficulty,
      duration: result.recommendedTechReel.duration,
      author: result.recommendedTechReel.author,
      excerpt: result.recommendedTechReel.excerpt,
      hashtags: result.recommendedTechReel.hashtags
    },
    "CATEGORY": result.category,
    "WHY THIS RECOMMENDATION": result.whyThisRecommendation,
    "DIFFICULTY": result.difficulty,
    "CONFIDENCE": `${result.confidence}%`,
    "ANTI_HYPE_PENALTY_APPLIED": result.hypePenaltyApplied,
    "ANTI_HYPE_EXPLANATION": result.hypePenaltyExplanation || "Passed anti-hype filter without penalty",
    "UPDATED_INTEREST_PROFILE": result.updatedInterestProfile.map(p => ({
      domain: p.label,
      score: `${p.score}%`,
      growth: p.growth > 0 ? `+${p.growth}%` : '0%'
    })),
    "AI_REASONING_CHAIN": result.reasoningSteps
  };

  const jsonString = JSON.stringify(structuredOutput, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Gemini Structured Recommendation JSON
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Exact key-value schema matching 8 core fields specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-4 py-2 bg-stone-50/70 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800/80 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('structured')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'structured'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Formatted 8-Field Output
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'raw'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Full Raw Payload
          </button>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-4 overflow-y-auto font-mono text-xs text-stone-800 dark:text-stone-300 bg-stone-50 dark:bg-stone-950 flex-1 leading-relaxed selection:bg-indigo-500/30">
          <pre className="whitespace-pre-wrap">
            {activeTab === 'structured'
              ? jsonString
              : JSON.stringify(result, null, 2)}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="truncate pr-2">Keys: CURRENT REEL • INTEREST DETECTED • WHY • RECOMMENDED TECH REEL • CATEGORY • WHY THIS RECOMMENDATION • DIFFICULTY • CONFIDENCE</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
