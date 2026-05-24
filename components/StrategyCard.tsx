'use client';

import { useState } from 'react';
import { StrategyDraft } from '@/lib/types';
import { Copy, Check, Share2, Clock, Target, Lightbulb, Image as ImageIcon } from 'lucide-react';

interface StrategyCardProps {
  draft: StrategyDraft;
  onCopied?: () => void;
}

export function StrategyCard({
  draft,
  onCopied,
}: StrategyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft.text);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(draft.text);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="bg-black border-b border-zinc-900 p-6 hover:bg-zinc-950 transition-colors group">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {draft.category}
            </span>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">{draft.postingTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-full hover:bg-zinc-900 transition-colors ${copied ? 'text-green-500' : 'text-zinc-500 hover:text-white'}`}
              title="Copy Text"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={handleShareToX}
              className="p-2 rounded-full hover:bg-zinc-900 text-zinc-500 hover:text-sky-400 transition-colors"
              title="Post to X"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Post Text */}
        <div className="relative">
          <p className="text-zinc-100 text-lg leading-relaxed font-medium whitespace-pre-wrap">
            {draft.text}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-500">
              <ImageIcon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Media Suggestion</span>
            </div>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed">
              {draft.mediaType}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-500">
              <Target className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Strategy</span>
            </div>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed">
              {draft.strategy}
            </p>
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 mt-2">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Why this works</span>
          </div>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">
            {draft.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}
