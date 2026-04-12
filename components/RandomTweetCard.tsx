'use client';

import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface RandomTweetCardProps {
  tweet: string;
  index: number;
  onCopied?: () => void;
}

export function RandomTweetCard({
  tweet,
  index,
  onCopied,
}: RandomTweetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tweet);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(tweet);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="bg-black border-b border-zinc-900 p-5 hover:bg-zinc-950 transition-colors group">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-bold text-sm">#{index + 1}</span>
        </div>

        <div className="mt-1">
          <p className="text-zinc-100 text-[15px] leading-normal font-medium whitespace-pre-wrap">
            {tweet}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-1">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 text-zinc-500 hover:text-white transition-colors ${copied ? 'text-white' : ''}`}
              title="Copy Tweet"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="text-xs font-bold uppercase tracking-wider">
                {copied ? 'Copied' : 'Copy'}
              </span>
            </button>

            <button
              onClick={handleShareToX}
              className="flex items-center gap-2 text-zinc-500 hover:text-sky-400 transition-colors"
              title="Post to X"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Post</span>
            </button>
          </div>

          <div className="text-[11px] font-black tabular-nums tracking-widest text-zinc-600">
            {tweet.length}/280
          </div>
        </div>
      </div>
    </div>
  );
}
