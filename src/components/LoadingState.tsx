import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, ShieldAlert, Cpu, Layers } from 'lucide-react';

interface LoadingStateProps {
  currentReelTitle: string;
}

const STEPS = [
  {
    title: 'Parsing Lexical Semantics & Spoken Transcript...',
    desc: 'Extracting technical signals beyond superficial keywords and titles',
    icon: Brain,
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    title: 'Evaluating Anti-Hype Shield & Clickbait Penalties...',
    desc: 'Filtering out shallow get-rich-quick claims and promotional marketing buzz',
    icon: ShieldAlert,
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Accumulating Multi-Axis Technical Interest Vector...',
    desc: 'Re-weighting session scores across systems, AI, databases, and microarchitectures',
    icon: Layers,
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Selecting High-Craft Tech Reel Recommendation...',
    desc: 'Matching inferred latent curiosity with peer-validated engineering deep dives',
    icon: Cpu,
    color: 'text-emerald-600 dark:text-emerald-400',
  },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ currentReelTitle }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-stone-900 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center gap-6 relative overflow-hidden min-h-[380px]">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      {/* Central Pulsing Orb */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/40 animate-ping absolute" />
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/20 relative z-10">
          <Sparkles className="w-7 h-7 animate-spin [animation-duration:4s]" />
        </div>
      </div>

      {/* Header Info */}
      <div className="text-center max-w-md z-10">
        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20 rounded-full">
          Gemini 3.7 Flash Reasoning
        </span>
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-2">
          Analyzing Latent Technical Curiosity
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 truncate max-w-sm mx-auto">
          Current Reel: "{currentReelTitle}"
        </p>
      </div>

      {/* Steps List */}
      <div className="w-full max-w-md flex flex-col gap-2.5 z-10">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                isActive
                  ? 'bg-indigo-50/80 dark:bg-stone-950 border-indigo-500/60 shadow-md scale-[1.01]'
                  : isDone
                  ? 'bg-stone-50 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                  : 'bg-stone-50/40 dark:bg-stone-950/30 border-stone-200/50 dark:border-stone-800/40 opacity-40'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/40 dark:text-indigo-300'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-stone-100 text-stone-400 dark:bg-stone-900 dark:text-stone-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1">
                <p className={`text-xs font-semibold ${isActive ? 'text-stone-900 dark:text-stone-100' : 'text-stone-700 dark:text-stone-300'}`}>
                  {step.title}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">
                  {step.desc}
                </p>
              </div>

              {isActive && (
                <span className="flex h-2 w-2 relative shrink-0 mt-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
