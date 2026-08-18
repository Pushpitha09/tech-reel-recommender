import React, { useState } from 'react';
import { X, Sparkles, Plus, AlertCircle, Bot } from 'lucide-react';
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

    // Note: Category and Difficulty are NOT passed as inputs from user dropdowns
    // The AI determines both automatically from content and transcript
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Submit Reel for Latent AI Recommendation
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Provide title and transcript — AI will automatically infer Category & Difficulty
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-4 py-2.5 bg-stone-50/80 dark:bg-stone-950/90 border-b border-stone-200 dark:border-stone-800/80 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Quick Fill Templates
          </span>
          <div className="flex flex-wrap gap-1.5">
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
              className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 dark:border-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
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
              className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 dark:border-amber-500/30 dark:text-amber-300 text-[11px] font-medium transition-colors cursor-pointer"
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
              className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 dark:border-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Distributed OpenTelemetry
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex flex-col gap-4 flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-500/30 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Notice Banner */}
          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
            <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Automatic Categorization & Difficulty:</span> You no longer need to pick a category or difficulty. The Gemini AI will extract technical complexity and domain classification automatically from your video's content and transcript.
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>Reel Title *</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Headline or video title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why Rust's Borrow Checker Saved Our Prod Database"
              className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Reel Caption / Social Post
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Stop chasing data races at 3 AM. Lifetime tracking explained."
              className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Transcript */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>Spoken Video Transcript *</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Used for Latent Interest Extraction</span>
            </label>
            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Enter or paste the spoken audio transcript of what happens in the video..."
              className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
              required
            />
          </div>

          {/* Hashtags & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Hashtags (comma separated)
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#rust, #concurrency, #database"
                className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Creator / Channel Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Elena Rostova"
                className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze & Get Recommendation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
