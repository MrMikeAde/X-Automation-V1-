import { NextRequest, NextResponse } from 'next/server';
import { generateRandomTweets } from '@/lib/groq';
import { validateGroqApiKey } from '@/lib/validation';
import {
  checkRateLimit,
  getIpFromRequest,
} from '@/lib/rate-limiter';

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

    const body = await request.json();
    const { groqApiKey } = body;

    const validation = validateGroqApiKey(groqApiKey);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid API key' },
        { status: 400 }
      );
    }

    const tweets = await generateRandomTweets(groqApiKey);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tweets,
    });
  } catch (error) {
    console.error('Error in /api/random:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
