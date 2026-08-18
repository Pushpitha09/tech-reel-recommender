import React, { useState, useEffect, useRef } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="json-viewer-title"
      aria-describedby="json-viewer-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden focus:outline-none"
        tabIndex={-1}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30"
              aria-hidden="true"
            >
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 id="json-viewer-title" className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Gemini Structured Recommendation JSON
              </h3>
              <p id="json-viewer-desc" className="text-[11px] text-stone-500 dark:text-stone-400">
                Exact key-value schema matching 8 core fields specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied JSON payload to clipboard" : "Copy structured JSON to clipboard"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200 text-xs font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div 
          role="tablist"
          aria-label="JSON representation views"
          className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-950 px-4 pt-2 gap-2"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'structured'}
            aria-controls="structured-tabpanel"
            id="tab-structured"
            type="button"
            onClick={() => setActiveTab('structured')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              activeTab === 'structured'
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 border-t border-x border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Formatted 8-Field Schema
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'raw'}
            aria-controls="raw-tabpanel"
            id="tab-raw"
            type="button"
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              activeTab === 'raw'
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 border-t border-x border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Raw Complete Object
          </button>
        </div>

        {/* JSON Code Viewer */}
        <div 
          role="tabpanel"
          id={activeTab === 'structured' ? 'structured-tabpanel' : 'raw-tabpanel'}
          aria-labelledby={activeTab === 'structured' ? 'tab-structured' : 'tab-raw'}
          tabIndex={0}
          className="p-4 overflow-auto flex-1 bg-stone-900 text-stone-100 font-mono text-xs leading-relaxed focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
        >
          <pre className="text-emerald-400">
            <code>
              {activeTab === 'structured'
                ? jsonString
                : JSON.stringify(result, null, 2)}
            </code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="font-mono">Payload Size: {jsonString.length} bytes</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
