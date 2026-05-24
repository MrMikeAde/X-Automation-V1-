import { NextRequest, NextResponse } from 'next/server';
import { generateGrowthStrategyDrafts } from '@/lib/groq';
import { validateGroqApiKey } from '@/lib/validation';
import { getWorldwideTrends } from '@/lib/scraper';
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

    // Optionally fetch trends to provide context to the strategist
    let context = '';
    try {
      const trends = await getWorldwideTrends();
      context = trends.map(t => t.name).join(', ');
    } catch (e) {
      console.error('Failed to fetch trends for context:', e);
    }

    const drafts = await generateGrowthStrategyDrafts(groqApiKey, context);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      drafts,
    });
  } catch (error) {
    console.error('Error in /api/strategy:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
