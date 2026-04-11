'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TrendCard } from '@/components/TrendCard';
import { Trend, BangersResponse } from '@/lib/types';
import { Flame, Settings, RotateCw, Copy } from 'lucide-react';

export default function Page() {
  const [groqKey, setGroqKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load Groq key from localStorage on mount
  useEffect(() => {
    const savedGroqKey = localStorage.getItem('groq_key');
    if (savedGroqKey) setGroqKey(savedGroqKey);
  }, []);

  const handleSaveKeys = () => {
    if (!groqKey.trim()) {
      setError('Groq API key is required');
      return;
    }
    localStorage.setItem('groq_key', groqKey);
    setShowSettings(false);
    showToast('API key saved successfully! 🔐');
  };

  const handleClearKeys = () => {
    localStorage.removeItem('groq_key');
    setGroqKey('');
    showToast('API key cleared');
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFetchTrends = async () => {
    setError(null);
    setTrends([]);

    if (!groqKey.trim()) {
      setError('Please set your Groq API key first');
      setShowSettings(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/bangers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groqApiKey: groqKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Failed to fetch trends');
      }

      const data = (await response.json()) as BangersResponse;
      setTrends(data.trends);
      showToast('Fresh bangers loaded! 🔥');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Trends page temporarily down, try again in a minute';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTrend = (updatedTrend: Trend) => {
    setTrends((prevTrends) =>
      prevTrends.map((t) => (t.rank === updatedTrend.rank ? updatedTrend : t))
    );
    showToast('Tweet refreshed!');
  };

  const handleCopyAll = async () => {
    const allTweets = trends
      .map((t) => `${t.topic}\n${t.generatedTweet}`)
      .join('\n\n---\n\n');

    try {
      await navigator.clipboard.writeText(allTweets);
      showToast('All tweets copied to clipboard! 📋');
    } catch (error) {
      console.error('[v0] Failed to copy all:', error);
      setError('Failed to copy tweets');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-500/90 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-900 border-slate-700 w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">API Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Groq API Key
                </label>
                <Input
                  type="password"
                  placeholder="gsk_..."
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Free API key at{' '}
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    console.groq.com
                  </a>
                </p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <p className="text-xs text-emerald-300">
                  ✓ Trends fetched from public sources • No X API key required
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSaveKeys}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Save Key
                </Button>
                <Button
                  onClick={handleClearKeys}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Clear
                </Button>
              </div>

              <Button
                onClick={() => setShowSettings(false)}
                variant="ghost"
                className="w-full text-slate-400 hover:text-slate-300"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-8 w-8 text-emerald-500" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                NaijaTrendBanger
              </h1>
            </div>
            <p className="text-slate-400 text-lg">
              10 fresh trending topics in Nigeria → 10 ready-to-post Naija bangers
            </p>
          </div>
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            size="icon"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            No bot vibes. Pure Naija pidgin, hype, and real talk.
          </h2>
            <p className="text-slate-300 mb-6">
              Pull the hottest Nigerian trends from public sources and let Groq cook
              up authentic Naija-style tweets that sound like a real sharp guy
              posting. Only need a Groq API key—no X credentials required!
            </p>
            <Button
            onClick={handleFetchTrends}
            disabled={loading}
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            {loading ? (
              <>
                <RotateCw className="h-5 w-5 mr-2 animate-spin" />
                Pulling hot trends from Naija Twitter... Oya make we cook bangers
              </>
            ) : (
              <>
                <Flame className="h-5 w-5 mr-2" />
                Fetch 10 Latest Naija Trends & Generate Bangers
              </>
            )}
          </Button>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-500/10 border-red-500/30 p-4 mb-8">
            <p className="text-red-400">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </Card>
        )}

        {/* Results Section */}
        {trends.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Top 10 Trends in Nigeria
              </h3>
              <Button
                onClick={handleCopyAll}
                variant="outline"
                size="sm"
                className="border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-400"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {trends.map((trend) => (
                <TrendCard
                  key={trend.rank}
                  trend={trend}
                  groqApiKey={groqKey}
                  onCopied={() => showToast('Tweet copied to clipboard! 📋')}
                  onRefreshed={handleUpdateTrend}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && trends.length === 0 && !error && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <Flame className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              Hit the button above to fetch the latest hot trends and generate
              some fire tweets!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
