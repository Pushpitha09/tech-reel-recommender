import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, AlertCircle, Bot, Sparkles } from 'lucide-react';
import { ReelItem } from '../types';

interface SubmitReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reel: ReelItem) => void;
  isLoading: boolean;
}

export const SubmitReelModal: React.FC<SubmitReelModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [transcript, setTranscript] = useState('');
  const [hashtags, setHashtags] = useState('#systems, #backend, #performance');
  const [author, setAuthor] = useState('Guest Engineer');
  const [error, setError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // Focus initial input
    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !transcript.trim()) {
      setError('Please provide at least a Reel title and a transcript.');
      return;
    }

    const tagArray = hashtags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const customReel: ReelItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      caption: caption.trim() || title.trim(),
      transcript: transcript.trim(),
      hashtags: tagArray,
      category: 'Auto-Detect by AI',
      author: author.trim() || 'Custom Submitter',
      authorHandle: `@${author.trim().toLowerCase().replace(/\s+/g, '_') || 'custom_user'}`,
      difficulty: 'Intermediate',
      duration: '0:50',
      views: '1.2K',
      likes: '142',
      technicalConcepts: ['User Submitted Reel'],
      thumbnailGradient: 'from-indigo-600/30 via-purple-600/20 to-stone-900',
    };

    onSubmit(customReel);
    onClose();
  };

  const loadPreset = (preset: {
    title: string;
    caption: string;
    transcript: string;
    hashtags: string;
  }) => {
    setTitle(preset.title);
    setCaption(preset.caption);
    setTranscript(preset.transcript);
    setHashtags(preset.hashtags);
    setError('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
      aria-describedby="submit-modal-description"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden focus:outline-none"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30"
              aria-hidden="true"
            >
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 id="submit-modal-title" className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Submit Reel for Latent AI Recommendation
              </h3>
              <p id="submit-modal-description" className="text-[11px] text-stone-500 dark:text-stone-400">
                Provide title and transcript — AI will automatically infer Category & Difficulty
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

        {/* Quick Presets */}
        <div className="px-4 py-2.5 bg-stone-50/80 dark:bg-stone-950/90 border-b border-stone-200 dark:border-stone-800/80 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Quick Fill Templates
          </span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Sample Reel Presets">
            <button
              type="button"
              onClick={() =>
                loadPreset({
                  title: 'Profiling CPU Cache Misses in High-Frequency Trading Engines',
                  caption: 'How L3 cache thrashing drops latency from 40ns to 350ns on AMD EPYC.',
                  transcript:
                    'In our order execution engine, we noticed non-deterministic p99 latency spikes during market open. We used Linux perf c2c to trace cache coherence invalidation. Our ring buffer structs were straddling 64-byte cache line boundaries. Adding alignas(64) padding prevented cross-core false sharing and reduced jitter by 82%.',
                  hashtags: '#lowlevel, #hft, #cache, #cpp, #perf',
                })
              }
              aria-label="Load HFT Cache Line Optimization preset"
              className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 dark:border-stone-700 text-[11px] font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              HFT Cache Line Optimization
            </button>

            <button
              type="button"
              onClick={() =>
                loadPreset({
                  title: 'How to make $1,000,000 using AI agents while sleeping! 💰🚀',
                  caption: 'Quit your 9 to 5 right now! Secret auto-blogger prints money on autopilot!',
                  transcript:
                    'Stop writing code right now! This secret AI automator creates 50 SaaS apps in 10 minutes and hooks up affiliate links automatically. I made 500k in my sleep yesterday! Drop a comment with CASH to get my 100x prompt masterclass before the billionaires delete this video!',
                  hashtags: '#passiveincome, #makemoney, #chatgpt, #aihype',
                })
              }
              aria-label="Load AI Hype / Clickbait Test preset"
              className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 dark:border-amber-500/30 dark:text-amber-300 text-[11px] font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              AI Hype / Clickbait Test
            </button>

            <button
              type="button"
              onClick={() =>
                loadPreset({
                  title: 'Distributed Tracing with OpenTelemetry Context Propagation in gRPC',
                  caption: 'Passing traceparent headers across async microservices boundary.',
                  transcript:
                    'When a request crosses 8 microservices, standard log correlation fails. OpenTelemetry uses W3C TraceContext headers over HTTP2 metadata in gRPC. We inject span contexts at the ingress gateway and extract them inside downstream handlers, maintaining unified waterfall timelines across asynchronous Goroutines.',
                  hashtags: '#opentelemetry, #grpc, #golang, #microservices',
                })
              }
              aria-label="Load Distributed OpenTelemetry preset"
              className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 dark:border-stone-700 text-[11px] font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              Distributed OpenTelemetry
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex flex-col gap-4 flex-1">
          {error && (
            <div 
              role="alert" 
              className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-500/30 dark:text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Notice Banner */}
          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
            <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-semibold">Automatic Categorization & Difficulty:</span> The Gemini AI model extracts technical complexity, latent signals, and domain classification automatically from your video's content and transcript.
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="submit-title" className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>Reel Title *</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Headline or video title</span>
            </label>
            <input
              ref={titleInputRef}
              id="submit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why Rust's Borrow Checker Saved Our Prod Database"
              className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
              required
              aria-required="true"
            />
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="submit-caption" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Reel Caption / Social Post
            </label>
            <input
              id="submit-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Stop chasing data races at 3 AM. Lifetime tracking explained."
              className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Transcript */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="submit-transcript" className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>Spoken Video Transcript *</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Used for Latent Interest Extraction</span>
            </label>
            <textarea
              id="submit-transcript"
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Enter or paste the spoken audio transcript of what happens in the video..."
              className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors leading-relaxed"
              required
              aria-required="true"
            />
          </div>

          {/* Hashtags & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="submit-hashtags" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Hashtags (comma separated)
              </label>
              <input
                id="submit-hashtags"
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#rust, #concurrency, #database"
                className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="submit-author" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Creator / Channel Name
              </label>
              <input
                id="submit-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Elena Rostova"
                className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Analyze & Get Recommendation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
