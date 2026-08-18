import React, { useEffect, useRef } from 'react';
import { X, Play, Compass, Database, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import { DEMO_TRAILS, REELS_DATASET } from '../data/reelsDataset';
import { ReelItem } from '../types';

interface DemoTrailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReel: (reel: ReelItem) => void;
}

export const DemoTrailsModal: React.FC<DemoTrailsModalProps> = ({
  isOpen,
  onClose,
  onSelectReel,
}) => {
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

  if (!isOpen) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Database':
        return <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />;
      case 'ShieldAlert':
        return <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />;
      default:
        return <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-trails-title"
      aria-describedby="demo-trails-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden focus:outline-none"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30"
              aria-hidden="true"
            >
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 id="demo-trails-title" className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Curated Demo Interaction Trails
              </h3>
              <p id="demo-trails-desc" className="text-[11px] text-stone-500 dark:text-stone-400">
                Pre-scripted multi-step interaction journeys demonstrating latent learning and anti-hype filtering
              </p>
            </div>
          </div>

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

        {/* Trail Cards */}
        <div className="p-4 overflow-y-auto flex flex-col gap-3.5 flex-1">
          {DEMO_TRAILS.map((trail) => {
            const initialReel = REELS_DATASET.find((r) => r.id === trail.initialReelId);

            return (
              <div
                key={trail.id}
                className="bg-stone-50/70 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-xl p-4 transition-all flex flex-col gap-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shrink-0">
                      {getIcon(trail.iconName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {trail.title}
                      </h4>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                        {trail.subtitle}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                        {trail.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trail Steps Overview */}
                <div className="flex items-center gap-2 pt-2 border-t border-stone-200 dark:border-stone-800/80 overflow-x-auto">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 shrink-0">
                    Watch Chain:
                  </span>
                  {trail.trailReelIds.map((rId, idx) => {
                    const r = REELS_DATASET.find((reel) => reel.id === rId);
                    return (
                      <React.Fragment key={rId}>
                        {idx > 0 && <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" aria-hidden="true" />}
                        <span className="px-2 py-0.5 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[10px] text-stone-700 dark:text-stone-300 font-mono shrink-0 truncate max-w-[140px]">
                          {r ? r.title.split(':')[0] : rId}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Action button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (initialReel) {
                        onSelectReel(initialReel);
                        onClose();
                      }
                    }}
                    aria-label={`Launch demo trail: ${trail.title}. Starts with ${initialReel?.title || 'first reel'}`}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                  >
                    <Play className="w-3 h-3 fill-white" aria-hidden="true" />
                    <span>Launch This Trail ({initialReel?.title.slice(0, 22)}...)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
