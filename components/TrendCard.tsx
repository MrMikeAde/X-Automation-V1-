'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const characterCount = trend.characterCount || trend.generatedTweet.length;
  const charPercentage = (characterCount / TWITTER_CHAR_LIMIT) * 100;
  const charStatus =
    characterCount <= 280 ? 'text-emerald-400' : 'text-red-400';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trend.generatedTweet);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('[v0] Failed to copy:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const response = await fetch('/api/bangers/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: trend.topic,
          groqApiKey,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(
          errorData.error || 'Failed to refresh tweet'
        );
      }

      const data = (await response.json()) as {
        tweet: string;
        characterCount: number;
      };

      const updatedTrend: Trend = {
        ...trend,
        generatedTweet: data.tweet,
        characterCount: data.characterCount,
      };

      onRefreshed?.(updatedTrend);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('[v0] Refresh failed:', errorMsg);
      setRefreshError(errorMsg);
      setTimeout(() => setRefreshError(null), 3000);
    } finally {
      setRefreshing(false);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(trend.generatedTweet);
    const xUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(xUrl, '_blank', 'width=550,height=420');
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 font-bold text-sm flex-shrink-0">
            {trend.rank}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-text-pretty">
              {trend.topic}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {trend.tweetVolume}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 flex-shrink-0"
        >
          Trend
        </Badge>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <p className="text-slate-100 leading-relaxed text-sm">
          {trend.generatedTweet}
        </p>
      </div>

      {/* Character counter */}
      <div className="flex items-center justify-between text-xs">
        <span className={charStatus}>
          {characterCount}/{TWITTER_CHAR_LIMIT} characters
        </span>
        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              charPercentage <= 100 ? 'bg-emerald-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(charPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Error message */}
      {refreshError && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2">
          {refreshError}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="flex-1 border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-400"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>

        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="border-slate-600 hover:border-slate-500 hover:bg-slate-800 text-slate-300"
          title="Generate a new tweet for this trend"
        >
          {refreshing ? (
            <>
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
              Cooking...
            </>
          ) : (
            <>
              <RotateCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>

        <Button
          onClick={handleShareToX}
          variant="outline"
          size="sm"
          className="border-sky-500/30 hover:border-sky-500 hover:bg-sky-500/10 text-sky-400"
          title="Post to X/Twitter"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
