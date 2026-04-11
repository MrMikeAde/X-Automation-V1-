import { NextRequest, NextResponse } from 'next/server';
import { getNigeriaTrends } from '@/lib/scraper';
import { generateNaijaTweet, GeneratedTweet } from '@/lib/groq';
import { BangersRequest, BangersResponse, Trend } from '@/lib/types';
import { validateGroqApiKey } from '@/lib/validation';
import {
  checkRateLimit,
  getIpFromRequest,
  cleanupOldEntries,
} from '@/lib/rate-limiter';

// Cleanup old rate limit entries occasionally
if (Math.random() < 0.1) {
  // ~10% of requests trigger cleanup
  cleanupOldEntries();
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getIpFromRequest(request);
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Please try again in ${Math.ceil(rateLimit.resetIn / 1000)} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as BangersRequest;
    const { groqApiKey } = body;

    // Validate API key format
    const validation = validateGroqApiKey(groqApiKey);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid API key' },
        { status: 400 }
      );
    }

    // Fetch trends from public source (via scraper)
    const scrapedTrends = await getNigeriaTrends();

    if (scrapedTrends.length === 0) {
      return NextResponse.json(
        {
          error:
            'Trends page temporarily down, try again in a minute. Using demo data instead.',
        },
        { status: 503 }
      );
    }

    // Generate tweets for each trend
    const trends: Trend[] = [];
    for (let i = 0; i < scrapedTrends.length; i++) {
      const trendData = scrapedTrends[i];
      try {
        const result = await generateNaijaTweet(
          trendData.name,
          groqApiKey
        );
        trends.push({
          rank: i + 1,
          topic: trendData.name,
          tweetVolume: trendData.volume || 'Trending',
          generatedTweet: result.text,
          characterCount: result.characterCount,
        });
      } catch (tweetError) {
        const errorMsg =
          tweetError instanceof Error ? tweetError.message : 'Unknown error';
        console.error(
          `[v0] Failed to generate tweet for ${trendData.name}:`,
          errorMsg
        );

        // Check if it's an auth error - propagate to user
        if (
          errorMsg.includes('Invalid Groq API key') ||
          errorMsg.includes('Unauthorized')
        ) {
          return NextResponse.json(
            { error: errorMsg },
            { status: 401 }
          );
        }

        // Check if it's a rate limit error
        if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
          return NextResponse.json(
            { error: errorMsg },
            { status: 429 }
          );
        }

        // Continue with next trend for other errors
        trends.push({
          rank: i + 1,
          topic: trendData.name,
          tweetVolume: trendData.volume || 'Trending',
          generatedTweet:
            'Na we go chop this tweet banger later sha. Groq servers are busy, try again soon!',
          characterCount: 0,
        });
      }
    }

    const response: BangersResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      trends,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[v0] Error in /api/bangers:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
