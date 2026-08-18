import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ReelPlayerCard } from './components/ReelPlayerCard';
import { CompactRecommendationSummaryCard } from './components/CompactRecommendationSummaryCard';
import { DetailedReasoningAccordion } from './components/DetailedReasoningAccordion';
import { CatalogueFeed } from './components/CatalogueFeed';
import { StructuredJsonViewer } from './components/StructuredJsonViewer';
import { SubmitReelModal } from './components/SubmitReelModal';
import { DemoTrailsModal } from './components/DemoTrailsModal';
import { LoadingState } from './components/LoadingState';
import { REELS_DATASET, INITIAL_INTEREST_DOMAINS } from './data/reelsDataset';
import { ReelItem, RecommendationResult, InterestDomain, SessionHistoryEntry } from './types';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function App() {
  const [reelsCatalog] = useState<ReelItem[]>(REELS_DATASET);
  const [currentReel, setCurrentReel] = useState<ReelItem>(REELS_DATASET[0]);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);
  const [interestProfile, setInterestProfile] = useState<InterestDomain[]>(INITIAL_INTEREST_DOMAINS);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [antiHypeStrictness, setAntiHypeStrictness] = useState<'normal' | 'strict'>('strict');

  // Theme State: 'light' by default as requested by user
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Synchronize 'dark' class on HTML document root for Tailwind styling
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Modals & Panels
  const [isJsonInspectorOpen, setIsJsonInspectorOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDemoTrailsOpen, setIsDemoTrailsOpen] = useState(false);
  const [selectedHistoryEntryId, setSelectedHistoryEntryId] = useState<string | undefined>(undefined);

  // Call Gemini Recommendation API
  const handleAnalyzeReel = async (reelToAnalyze: ReelItem, isCustom = false) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const historyPayload = sessionHistory.map((h) => ({
        title: h.reel.title,
        extractedTopic: h.result.currentReel.extractedTopic,
        underlyingInterest: h.result.interestDetected,
      }));

      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentReel: reelToAnalyze,
          sessionHistory: historyPayload,
          currentProfile: interestProfile,
          antiHypeStrictness,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const payload = await response.json();

      if (!payload.success || !payload.data) {
        throw new Error(payload.error || 'Failed to extract recommendation');
      }

      const result: RecommendationResult = payload.data;
      setRecommendationResult(result);

      // Merge updated profile scores
      if (result.updatedInterestProfile && Array.isArray(result.updatedInterestProfile)) {
        setInterestProfile((prevProfile) =>
          prevProfile.map((domain) => {
            const updated = result.updatedInterestProfile.find((u) => u.key === domain.key);
            if (updated) {
              return {
                ...domain,
                score: updated.score,
                growth: updated.growth,
                description: updated.description || domain.description,
              };
            }
            return domain;
          })
        );
      }

      // Add to session history
      const newHistoryEntry: SessionHistoryEntry = {
        id: `entry-${Date.now()}`,
        timestamp: Date.now(),
        reel: reelToAnalyze,
        result,
        isCustomSubmission: isCustom,
      };

      setSessionHistory((prev) => [newHistoryEntry, ...prev]);
      setSelectedHistoryEntryId(newHistoryEntry.id);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred while contacting the Gemini AI engine.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial trigger on mount
  useEffect(() => {
    handleAnalyzeReel(REELS_DATASET[0]);
  }, []);

  // Handle selecting a reel from the catalogue
  const handleSelectReel = (reel: ReelItem) => {
    setCurrentReel(reel);
    handleAnalyzeReel(reel);
  };

  // Handle clicking "Watch Next" on recommendation
  const handleSelectRecommendedReel = (reelId: string) => {
    const nextReel = reelsCatalog.find((r) => r.id === reelId);
    if (nextReel) {
      setCurrentReel(nextReel);
      handleAnalyzeReel(nextReel);
    }
  };

  // Handle custom submission from modal
  const handleCustomSubmit = (customReel: ReelItem) => {
    setCurrentReel(customReel);
    handleAnalyzeReel(customReel, true);
  };

  // Handle clicking a historic entry
  const handleSelectHistoryEntry = (entry: SessionHistoryEntry) => {
    setSelectedHistoryEntryId(entry.id);
    setCurrentReel(entry.reel);
    setRecommendationResult(entry.result);
  };

  // Reset entire session
  const handleResetSession = () => {
    setInterestProfile(INITIAL_INTEREST_DOMAINS);
    setSessionHistory([]);
    setCurrentReel(REELS_DATASET[0]);
    handleAnalyzeReel(REELS_DATASET[0]);
  };

  // Calculate leading domain for header
  const sortedProfile = [...interestProfile].sort((a, b) => b.score - a.score);
  const topDomain = sortedProfile[0] || null;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:bg-indigo-500/30 dark:selection:text-white">
      {/* Top Navigation Header with Light/Dark Theme Switcher */}
      <Header
        totalAnalyzed={sessionHistory.length}
        topDomain={topDomain}
        antiHypeStrictness={antiHypeStrictness}
        onToggleStrictness={() =>
          setAntiHypeStrictness((prev) => (prev === 'strict' ? 'normal' : 'strict'))
        }
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenDemoTrails={() => setIsDemoTrailsOpen(true)}
        onResetSession={handleResetSession}
        theme={theme}
        onToggleTheme={toggleTheme}
        isLoading={isLoading}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Error Notification Banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleAnalyzeReel(currentReel)}
              className="px-3 py-1 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-900/60 dark:hover:bg-rose-800 dark:text-rose-100 font-medium text-xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Top Split Area: Left = Currently Watched Reel | Right = AI Recommendation Compact Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Current Reel Player (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Reel Video
              </span>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                + Submit Your Own
              </button>
            </div>

            <ReelPlayerCard
              reel={currentReel}
              onAnalyze={handleAnalyzeReel}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Compact 8-Field Summary Card (7 cols on lg) - No scrolling needed */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Recommendation Summary
              </span>

              {recommendationResult && (
                <button
                  onClick={() => setIsJsonInspectorOpen(true)}
                  className="text-xs text-stone-600 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-stone-200 font-mono flex items-center gap-1 cursor-pointer"
                >
                  Structured JSON Schema →
                </button>
              )}
            </div>

            {isLoading ? (
              <LoadingState currentReelTitle={currentReel.title} />
            ) : recommendationResult ? (
              <CompactRecommendationSummaryCard
                result={recommendationResult}
                onSelectRecommendedReel={handleSelectRecommendedReel}
                onOpenJsonInspector={() => setIsJsonInspectorOpen(true)}
                reelsCatalog={reelsCatalog}
                isLoading={isLoading}
              />
            ) : (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 text-center text-stone-500 dark:text-stone-400">
                Click "Analyze Latent Interest" to trigger Gemini deduction.
              </div>
            )}
          </div>
        </div>

        {/* Collapsed Detailed Reasoning Section: Session Interest Profile, Interaction Trail, and AI Deduction Path */}
        {recommendationResult && (
          <DetailedReasoningAccordion
            result={recommendationResult}
            profile={interestProfile}
            sessionHistory={sessionHistory}
            onSelectHistoryEntry={handleSelectHistoryEntry}
            selectedHistoryEntryId={selectedHistoryEntryId}
          />
        )}

        {/* Bottom Section: Full Reel Catalogue Feed */}
        <CatalogueFeed
          reels={reelsCatalog}
          activeReelId={currentReel.id}
          onSelectReel={handleSelectReel}
          isLoading={isLoading}
        />
      </main>

      {/* Structured JSON Modal Inspector */}
      <StructuredJsonViewer
        result={recommendationResult}
        isOpen={isJsonInspectorOpen}
        onClose={() => setIsJsonInspectorOpen(false)}
      />

      {/* Custom Reel Submission Modal Form */}
      <SubmitReelModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleCustomSubmit}
        isLoading={isLoading}
      />

      {/* Demo Trails Walkthrough Modal */}
      <DemoTrailsModal
        isOpen={isDemoTrailsOpen}
        onClose={() => setIsDemoTrailsOpen(false)}
        onSelectTrail={(trail) => {
          const firstReel = reelsCatalog.find((r) => r.id === trail.initialReelId);
          if (firstReel) {
            handleSelectReel(firstReel);
          }
        }}
        onSelectReel={handleSelectReel}
      />
    </div>
  );
}
