'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TrendCard } from '@/components/TrendCard';
import { RandomTweetCard } from '@/components/RandomTweetCard';
import { Trend, BangersResponse } from '@/lib/types';
import { Settings, RotateCw, Copy, Check, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  const [groqKey, setGroqKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [randomTweets, setRandomTweets] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [copiedAllTrends, setCopiedAllTrends] = useState(false);
  const [copiedAllRandom, setCopiedAllRandom] = useState(false);

  // Load Groq key and saved tweets from localStorage on mount
  useEffect(() => {
    const savedGroqKey = localStorage.getItem('groq_key');
    if (savedGroqKey) setGroqKey(savedGroqKey);

    const savedTrends = localStorage.getItem('last_trends');
    if (savedTrends) {
      try {
        setTrends(JSON.parse(savedTrends));
      } catch (e) {
        console.error('Failed to parse saved trends', e);
      }
    }

    const savedRandom = localStorage.getItem('last_random');
    if (savedRandom) {
      try {
        setRandomTweets(JSON.parse(savedRandom));
      } catch (e) {
        console.error('Failed to parse saved random tweets', e);
      }
    }
  }, []);

  const handleSaveKeys = () => {
    if (!groqKey.trim()) {
      setError('Groq API key is required');
      return;
    }
    localStorage.setItem('groq_key', groqKey);
    setShowSettings(false);
    showToast('API key saved');
  };

  const handleClearKeys = () => {
    localStorage.removeItem('groq_key');
    setGroqKey('');
    showToast('API key removed');
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFetchTrends = async () => {
    setError(null);
    setTrends([]);

    if (!groqKey.trim()) {
      setError('Please configure your Groq API key in settings.');
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
      localStorage.setItem('last_trends', JSON.stringify(data.trends));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRandom = async () => {
    setError(null);
    setRandomTweets([]);

    if (!groqKey.trim()) {
      setError('Please configure your Groq API key in settings.');
      setShowSettings(true);
      return;
    }

    setRandomLoading(true);
    try {
      const response = await fetch('/api/random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groqApiKey: groqKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Failed to fetch random tweets');
      }

      const data = await response.json();
      setRandomTweets(data.tweets);
      localStorage.setItem('last_random', JSON.stringify(data.tweets));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setRandomLoading(false);
    }
  };

  const handleUpdateTrend = (updatedTrend: Trend) => {
    setTrends((prevTrends) => {
      const newTrends = prevTrends.map((t) => (t.rank === updatedTrend.rank ? updatedTrend : t));
      localStorage.setItem('last_trends', JSON.stringify(newTrends));
      return newTrends;
    });
  };

  const handleCopyAll = async (type: 'trends' | 'random') => {
    const allTweets = type === 'trends'
      ? trends.map((t) => t.generatedTweet).join('\n\n')
      : randomTweets.join('\n\n');

    try {
      await navigator.clipboard.writeText(allTweets);
      if (type === 'trends') {
        setCopiedAllTrends(true);
        setTimeout(() => setCopiedAllTrends(false), 2000);
      } else {
        setCopiedAllRandom(true);
        setTimeout(() => setCopiedAllRandom(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy all:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium z-50 shadow-2xl">
          {toast}
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-black border border-zinc-800 w-full max-w-md p-6 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Configuration</h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">
                  Groq API Key
                </label>
                <Input
                  type="password"
                  placeholder="Paste your key here..."
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  className="bg-black border-zinc-800 focus:border-white transition-colors rounded-xl h-12"
                />
                <p className="text-xs text-zinc-500 mt-3">
                  Get a free key at{' '}
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    console.groq.com
                  </a>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveKeys}
                  className="flex-1 bg-white text-black hover:bg-zinc-200 h-12 rounded-xl font-bold"
                >
                  Save
                </Button>
                <Button
                  onClick={handleClearKeys}
                  variant="outline"
                  className="flex-1 border-zinc-800 hover:bg-zinc-900 h-12 rounded-xl"
                >
                  Clear
                </Button>
              </div>

              <Button
                onClick={() => setShowSettings(false)}
                variant="ghost"
                className="w-full text-zinc-500 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              NaijaTrendBanger
            </h1>
            <p className="text-zinc-500 font-medium">
              Authentic Nigerian trends transformed into viral posts.
            </p>
          </div>
          <Button
            onClick={() => setShowSettings(true)}
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-full"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </header>

        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-950 border border-zinc-900 p-1 h-12 rounded-full mb-8">
            <TabsTrigger
              value="trends"
              className="rounded-full data-[state=active]:bg-zinc-800 data-[state=active]:text-white font-bold"
            >
              Nigeria Trends
            </TabsTrigger>
            <TabsTrigger
              value="random"
              className="rounded-full data-[state=active]:bg-zinc-800 data-[state=active]:text-white font-bold"
            >
              Random Tweets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-0 focus-visible:outline-none">
            {/* Hero / Action Section */}
            <section className="mb-12">
              <div className="space-y-6">
                <p className="text-xl text-zinc-300 leading-relaxed">
                  Skip the generic AI vibes. Get real Naija pidgin and street-smart commentary on the latest local trends.
                </p>
                <Button
                  onClick={handleFetchTrends}
                  disabled={loading}
                  className="w-full h-14 bg-white text-black hover:bg-zinc-200 text-lg font-black rounded-full transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <RotateCw className="h-5 w-5 mr-3 animate-spin" />
                      Analyzing trends...
                    </>
                  ) : (
                    'Generate Today\'s Bangers'
                  )}
                </Button>
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-8">
                <p className="text-sm text-zinc-400">
                  <span className="font-bold text-white mr-2">Note:</span> {error}
                </p>
              </div>
            )}

            {/* Results Section */}
            {trends.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between sticky top-0 py-4 bg-black/80 backdrop-blur-md z-10 border-b border-zinc-900">
                  <h2 className="text-lg font-bold">Nigeria Trends</h2>
                  <Button
                    onClick={() => handleCopyAll('trends')}
                    variant="ghost"
                    size="sm"
                    className="text-zinc-500 hover:text-white font-bold"
                  >
                    {copiedAllTrends ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedAllTrends ? 'Copied' : 'Copy All'}
                  </Button>
                </div>
                <div className="space-y-px bg-zinc-900 border-x border-zinc-900 overflow-hidden rounded-2xl border border-zinc-900">
                  {trends.map((trend) => (
                    <TrendCard
                      key={trend.rank}
                      trend={trend}
                      groqApiKey={groqKey}
                      onCopied={() => showToast('Copied to clipboard')}
                      onRefreshed={handleUpdateTrend}
                    />
                  ))}
                </div>
              </div>
            )}

            {!loading && trends.length === 0 && !error && (
              <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-500 font-medium">
                  No trends loaded yet. Tap the button above to start.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="random" className="mt-0 focus-visible:outline-none">
             {/* Hero / Action Section */}
             <section className="mb-12">
              <div className="space-y-6">
                <p className="text-xl text-zinc-300 leading-relaxed">
                  Generate 20 high-level viral tweets about life, psychology, and mindset reframes.
                </p>
                <Button
                  onClick={handleFetchRandom}
                  disabled={randomLoading}
                  className="w-full h-14 bg-white text-black hover:bg-zinc-200 text-lg font-black rounded-full transition-all active:scale-[0.98]"
                >
                  {randomLoading ? (
                    <>
                      <RotateCw className="h-5 w-5 mr-3 animate-spin" />
                      Cooking 20 bangers...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-3" />
                      Generate Today's Random
                    </>
                  )
                  }
                </Button>
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-8">
                <p className="text-sm text-zinc-400">
                  <span className="font-bold text-white mr-2">Note:</span> {error}
                </p>
              </div>
            )}

            {/* Results Section */}
            {randomTweets.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between sticky top-0 py-4 bg-black/80 backdrop-blur-md z-10 border-b border-zinc-900">
                  <h2 className="text-lg font-bold">Random Viral Tweets</h2>
                  <Button
                    onClick={() => handleCopyAll('random')}
                    variant="ghost"
                    size="sm"
                    className="text-zinc-500 hover:text-white font-bold"
                  >
                    {copiedAllRandom ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedAllRandom ? 'Copied' : 'Copy All'}
                  </Button>
                </div>
                <div className="space-y-px bg-zinc-900 border-x border-zinc-900 overflow-hidden rounded-2xl border border-zinc-900">
                  {randomTweets.map((tweet, i) => (
                    <RandomTweetCard
                      key={i}
                      index={i}
                      tweet={tweet}
                      onCopied={() => showToast('Copied to clipboard')}
                    />
                  ))}
                </div>
              </div>
            )}

            {!randomLoading && randomTweets.length === 0 && !error && (
              <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-500 font-medium">
                  Nothing here yet. Tap the button above to generate 20 random bangers.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <footer className="mt-20 pt-8 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Built for Naija Twitter • Powered by Groq
          </p>
        </footer>
      </div>
    </div>
  );
}
