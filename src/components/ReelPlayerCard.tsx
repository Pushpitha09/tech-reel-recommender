import React, { useState } from 'react';
import { Play, Pause, FileText, Sparkles, AlertTriangle, CheckCircle2, User, Eye, Heart, Hash, Layers } from 'lucide-react';
import { ReelItem } from '../types';

interface ReelPlayerCardProps {
  reel: ReelItem;
  onAnalyze: (reel: ReelItem) => void;
  isLoading: boolean;
  isCurrentlyActive?: boolean;
}

export const ReelPlayerCard: React.FC<ReelPlayerCardProps> = ({
  reel,
  onAnalyze,
  isLoading,
  isCurrentlyActive = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  return (
    <div 
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-md flex flex-col transition-all"
      role="region"
      aria-label={`Video player and details for ${reel.title}`}
    >
      {/* Top Banner / Video Mock Area */}
      <div 
        className={`relative h-60 bg-gradient-to-br ${reel.thumbnailGradient || 'from-indigo-900 to-slate-950'} p-5 flex flex-col justify-between overflow-hidden border-b border-stone-200 dark:border-stone-800/80 text-white`}
      >
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" aria-hidden="true" />

        {/* Top Badges */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-black/60 backdrop-blur-md text-stone-100 border border-white/20 flex items-center gap-1.5 shadow-sm">
              <Layers className="w-3 h-3 text-indigo-300" aria-hidden="true" />
              <span>{reel.category}</span>
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-black/50 text-stone-100 border border-white/20">
              {reel.difficulty}
            </span>
          </div>

          {reel.isHypeOrClickbait ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/40 text-amber-100 border border-amber-400/50 flex items-center gap-1 shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Hype / Clickbait Sample</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/40 text-emerald-100 border border-emerald-400/50 flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Verified Tech Depth</span>
            </span>
          )}
        </div>

        {/* Video Simulation Center Icon */}
        <div className="flex items-center justify-center my-auto z-10">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? `Pause video simulation for ${reel.title}` : `Play video simulation for ${reel.title}`}
            className="w-14 h-14 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:outline-none"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" aria-hidden="true" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" aria-hidden="true" />
            )}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>

        {/* Bottom Audio / Timeline Mock */}
        <div className="z-10 flex flex-col gap-2">
          {/* Animated Waveform Visualizer */}
          <div className="flex items-end gap-1 h-4 px-1" aria-hidden="true">
            {[40, 75, 50, 90, 65, 30, 85, 100, 45, 70, 80, 55, 95, 60, 40, 80, 65, 90, 50, 70].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-indigo-300' : 'bg-stone-400'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : '20%',
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-100 font-mono font-medium drop-shadow-sm">
            <span>{reel.duration || '0:58'}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1" aria-label={`${reel.views || '120k'} views`}>
                <Eye className="w-3.5 h-3.5 text-stone-200" aria-hidden="true" />
                <span>{reel.views || '120k'}</span>
              </span>
              <span className="flex items-center gap-1" aria-label={`${reel.likes || '18k'} likes`}>
                <Heart className="w-3.5 h-3.5 text-rose-300" aria-hidden="true" />
                <span>{reel.likes || '18k'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reel Information & Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-3.5 flex-1">
        {/* Author info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300"
              aria-hidden="true"
            >
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{reel.author}</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">{reel.authorHandle}</p>
            </div>
          </div>
        </div>

        {/* Title & Caption */}
        <div>
          <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
            {reel.title}
          </h2>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
            {reel.caption}
          </p>
        </div>

        {/* Hashtags */}
        {reel.hashtags && reel.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1" aria-label="Hashtags">
            {reel.hashtags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-stone-800 dark:text-indigo-300 text-[11px] font-mono border border-indigo-100 dark:border-stone-700"
              >
                <Hash className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
                <span>{tag.replace('#', '')}</span>
              </span>
            ))}
          </div>
        )}

        {/* Transcript Section */}
        <div className="rounded-xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800/80 p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" aria-hidden="true" />
              <span>Reel Spoken Audio Transcript</span>
            </span>
            <button
              type="button"
              onClick={() => setShowFullTranscript(!showFullTranscript)}
              aria-expanded={showFullTranscript}
              aria-label={showFullTranscript ? 'Collapse spoken transcript' : 'Expand full spoken transcript'}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded px-1"
            >
              {showFullTranscript ? 'Show Less' : 'Show Full Transcript'}
            </button>
          </div>

          <p className={`text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans ${showFullTranscript ? '' : 'line-clamp-3'}`}>
            "{reel.transcript}"
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-1">
          <button
            type="button"
            onClick={() => onAnalyze(reel)}
            disabled={isLoading}
            aria-label={`Analyze latent technical interest for ${reel.title}`}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>{isLoading ? 'Gemini AI Extracting Latent Interests...' : 'Analyze Latent Interest & Get Tech Reel'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
