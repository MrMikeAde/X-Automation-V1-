'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trend } from '@/lib/types';
import { Copy, Check, RotateCw, Share2 } from 'lucide-react';

const TWITTER_CHAR_LIMIT = 280;

interface TrendCardProps {
  trend: Trend;
  groqApiKey: string;
  onCopied?: () => void;
  onRefreshed?: (updatedTrend: Trend) => void;
}

export function TrendCard({
  trend,
  groqApiKey,
  onCopied,
  onRefreshed,
}: TrendCardProps) {
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const characterCount = trend.characterCount || trend.generatedTweet.length;
  const isOverLimit = characterCount > TWITTER_CHAR_LIMIT;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trend.generatedTweet);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/bangers/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: trend.topic,
          groqApiKey,
        }),
      });

      if (!response.ok) throw new Error('Refresh failed');

      const data = (await response.json()) as {
        tweet: string;
        characterCount: number;
      };

      onRefreshed?.({
        ...trend,
        generatedTweet: data.tweet,
        characterCount: data.characterCount,
      });
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(trend.generatedTweet);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="bg-black border-b border-zinc-900 p-5 hover:bg-zinc-950 transition-colors group">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-bold text-sm">#{trend.rank}</span>
            <h3 className="font-black text-white text-base tracking-tight">
              {trend.topic}
            </h3>
            <span className="text-zinc-500 text-xs font-medium">
              · {trend.tweetVolume}
            </span>
          </div>
        </div>

        {/* Tweet Content */}
        <div className="mt-1">
          <p className="text-zinc-100 text-[15px] leading-normal font-medium whitespace-pre-wrap">
            {trend.generatedTweet}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-2 pt-1">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 text-zinc-500 hover:text-white transition-colors ${copied ? 'text-white' : ''}`}
              title="Copy Tweet"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="text-xs font-bold uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 text-zinc-500 hover:text-white transition-colors ${refreshing ? 'animate-pulse' : ''}`}
              title="New Version"
            >
              <RotateCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-xs font-bold uppercase tracking-wider">Refresh</span>
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

          <div className={`text-[11px] font-black tabular-nums tracking-widest ${isOverLimit ? 'text-red-500' : 'text-zinc-600'}`}>
            {characterCount}/280
          </div>
        </div>
      </div>
    </div>
  );
}
