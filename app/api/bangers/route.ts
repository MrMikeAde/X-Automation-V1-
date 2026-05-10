import { NextRequest, NextResponse } from 'next/server';
import { getWorldwideTrends } from '@/lib/scraper';
import { generateGlobalTweet } from '@/lib/groq';
import { BangersRequest, BangersResponse, Trend } from '@/lib/types';
import { validateGroqApiKey } from '@/lib/validation';
import { LRUCache } from 'lru-cache';
import {
  checkRateLimit,
  getIpFromRequest,
} from '@/lib/rate-limiter';

// Initialize caches
const trendsCache = new LRUCache<string, any>({
  max: 50,
  ttl: 1000 * 60 * 15, // 15 minutes
});

const tweetsCache = new LRUCache<string, Trend[]>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export async function POST(request: NextRequest) {
  try {
    const ip = getIpFromRequest(request);
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Try again in ${Math.ceil(rateLimit.resetIn / 1000)}s.`,
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as BangersRequest;
    const { groqApiKey } = body;

    const validation = validateGroqApiKey(groqApiKey);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid API key' },
        { status: 400 }
      );
    }

    // Check trends cache
    let scrapedTrends = trendsCache.get('worldwide_trends');
    if (!scrapedTrends) {
      scrapedTrends = await getWorldwideTrends();
      trendsCache.set('worldwide_trends', scrapedTrends);
    }

    if (!scrapedTrends || scrapedTrends.length === 0) {
      return NextResponse.json(
        { error: 'Could not fetch trends. Try again soon.' },
        { status: 503 }
      );
    }

    // Check tweets cache (using hash of trends + apiKey to distinguish users)
    const cacheKey = `tweets_global_${scrapedTrends.map((t: any) => t.name).join('_').substring(0, 100)}_${groqApiKey.substring(0, 10)}`;
    const cachedTweets = tweetsCache.get(cacheKey);
    if (cachedTweets) {
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        trends: cachedTweets,
      });
    }

    // Parallel tweet generation
    const tweetPromises = scrapedTrends.map(async (trendData: any, index: number) => {
      try {
        const result = await generateGlobalTweet(trendData.name, groqApiKey);
        return {
          rank: index + 1,
          topic: trendData.name,
          tweetVolume: trendData.volume || 'Trending',
          generatedTweet: result.text,
          characterCount: result.characterCount,
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Generation failed';
        console.error(`Failed for ${trendData.name}:`, errorMsg);

        // If it's an auth error, we should probably let the user know more clearly
        // but for parallel generation, we return a per-item error message
        let displayError = 'Banger still loading. Tap refresh to cook it manually.';
        if (errorMsg.includes('Invalid Groq API key')) {
          displayError = 'Error: Invalid API Key. Check settings.';
        } else if (errorMsg.includes('Rate limit')) {
          displayError = 'Error: Rate limit reached. Try again later.';
        }

        return {
          rank: index + 1,
          topic: trendData.name,
          tweetVolume: trendData.volume || 'Trending',
          generatedTweet: displayError,
          characterCount: 0,
        };
      }
    });

    const trends = await Promise.all(tweetPromises);
    tweetsCache.set(cacheKey, trends);

    const response: BangersResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      trends,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/bangers:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
