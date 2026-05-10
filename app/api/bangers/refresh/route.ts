import { NextRequest, NextResponse } from 'next/server';
import { generateGlobalTweet, GeneratedTweet } from '@/lib/groq';
import { validateGroqApiKey } from '@/lib/validation';
import {
  checkRateLimit,
  getIpFromRequest,
} from '@/lib/rate-limiter';

interface RefreshRequest {
  topic: string;
  groqApiKey: string;
}

interface RefreshResponse {
  success: boolean;
  topic: string;
  tweet: string;
  characterCount: number;
  timestamp: string;
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

    const body = (await request.json()) as RefreshRequest;
    const { topic, groqApiKey } = body;

    // Validate inputs
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const validation = validateGroqApiKey(groqApiKey);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid API key' },
        { status: 400 }
      );
    }

    // Generate new tweet for the topic
    try {
      const result = await generateGlobalTweet(topic, groqApiKey);

      const response: RefreshResponse = {
        success: true,
        topic,
        tweet: result.text,
        characterCount: result.characterCount,
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(response);
    } catch (tweetError) {
      const errorMsg =
        tweetError instanceof Error ? tweetError.message : 'Unknown error';
      console.error(`Failed to refresh tweet for ${topic}:`, errorMsg);

      // Check for auth errors
      if (
        errorMsg.includes('Invalid Groq API key') ||
        errorMsg.includes('Unauthorized')
      ) {
        return NextResponse.json(
          { error: errorMsg },
          { status: 401 }
        );
      }

      // Check for rate limiting
      if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
        return NextResponse.json(
          { error: errorMsg },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in /api/bangers/refresh:', error);
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
