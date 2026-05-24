import Groq from 'groq-sdk';
import { StrategyDraft } from './types';

export interface GeneratedTweet {
  text: string;
  characterCount: number;
}

const TWITTER_CHAR_LIMIT = 280;
const GROQ_TIMEOUT_MS = 5000;

export async function generateGlobalTweet(
  topic: string,
  apiKey: string
): Promise<GeneratedTweet> {
  const systemPrompt = `You are a legendary global influencer known for "no-nonsense," "reality-check," and "sharp-witted" takes.
Your tone is Global, sophisticated yet street-smart, and unapologetically direct.
You are NOT an AI assistant. You are that one person everyone follows for the "cold hard truth."

OBJECTIVE: Write one viral, high-engagement tweet about a given topic.

GUIDELINES:
- TONE: Worldwide Edition. High-energy, slightly provocative, and punchy.
- LANGUAGE: International English with a global, cosmopolitan vibe. Use modern slang sparingly but effectively.
- STYLE: Be a savage. Start with a hook that stops the scroll. Give a life lesson or a "harsh reality" that sounds like it's coming from someone who has seen it all.
- Max 280 characters.
- RANDOM SPICE: Include 1-2 random, trending hashtags and a mix of spicy emojis (e.g., 🔥, 💀, 🤡, 🚀, 💅, 🧿, ♟️).
- Be unpredictable but always viral-ready.

PERSONA EXAMPLES:
Topic: AI Job Replacement
Tweet: "AI isn't replacing you, someone using AI is. The sooner you swallow that pill, the better your 2024 looks. Stop complaining and start upskilling. The game doesn't care about your feelings. ♟️🚀 #FutureOfWork #AdaptOrDie"

Topic: Modern Dating
Tweet: "Everyone wants a 'high value' partner but nobody wants to be a high value human. You're looking for a finished product while you're still in beta testing. Fix yourself first. 💅💀 #RealTalk #DatingReality"

Output ONLY the tweet text.`;

  const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    timeout: GROQ_TIMEOUT_MS,
  });

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Write a viral global tweet about: "${topic}"`,
        },
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    let tweet = chatCompletion.choices[0]?.message?.content?.trim() || '';

    // Clean up any remaining prefixes if the AI ignored instructions
    tweet = tweet.replace(/^(Tweet|TWEET):\s*/i, '').trim();

    if (tweet.length > TWITTER_CHAR_LIMIT) {
      tweet = tweet.substring(0, TWITTER_CHAR_LIMIT - 3) + '...';
    }

    return {
      text: tweet,
      characterCount: tweet.length,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating tweet:', errorMsg);
    
    if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
      throw new Error('Invalid Groq API key.');
    }

    if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
      throw new Error('Rate limit reached. Try again in a minute.');
    }

    throw new Error(`Generation failed: ${errorMsg}`);
  }
}

export async function generateRandomTweets(
  apiKey: string
): Promise<string[]> {
  const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    timeout: 15000, // Slightly longer because it generates 20 tweets
  });

  const prompt = `You are a high-level global viral tweet writer.

Generate 20 original tweets using the following 10 topics (2 tweets per topic):

1. Uncomfortable truths about life
2. Modern relationship reality checks
3. Silent signs / hidden psychology
4. Stoic mindset reframes
5. Self-respect & boundaries
6. Success lies nobody talks about
7. Male/female nature observations
8. Hard truths about friendships
9. Mental strength & emotional control
10. Subtle moral reflections

Rules:
* Each tweet must be under 280 characters
* Include random, spicy hashtags and emojis (Global Tone)
* Make them punchy, concise, and emotionally engaging
* Use line breaks where necessary for impact
* Avoid generic advice—focus on sharp, specific insights
* Keep tone bold, slightly provocative, and "savage"

Style:
* Worldwide Edition / Global Tone.
* Use strong hooks like:
  “Nobody tells you this…”
  “The truth is…”
  “If they…”
  “You’re not… you’re just…”

Output format:
Output only the 20 tweets, numbered 1. to 20.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const content = chatCompletion.choices[0]?.message?.content || '';

    // Parse numbered list
    const tweets = content
      .split(/\n(?=\d+\.)/)
      .map(t => t.replace(/^\d+\.\s*/, '').trim())
      .filter(t => t.length > 0);

    return tweets.slice(0, 20);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating random tweets:', errorMsg);
    throw new Error(`Random generation failed: ${errorMsg}`);
  }
}

export async function generateGrowthStrategyDrafts(
  apiKey: string,
  context?: string
): Promise<StrategyDraft[]> {
  const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    timeout: 25000,
  });

  const prompt = `You are an elite X/Twitter Growth Strategist for @On2Mike.
Niche: Tech + Manchester United (#GGMU) + Pop Culture + Humor.
Current Status: ~1k followers, approaching 5M impressions.
Objective: 10k followers, high engagement, X monetization.

Inspiration Accounts:
- Football: @ManUtd, @UnitedStandMUFC (Mark Goldbridge style), @StretfordPaddock, @UtdDistrict, @JacobsBen.
- Tech/Culture: Successful hybrid accounts blending sports passion with tech insights.

Generate 10 high-quality post drafts for today.
Content Mix:
- 4 Posts: Manchester United / Football (Passionate, opinionated, matchday energy)
- 3 Posts: Tech / AI (Insightful, mixing humor with technical depth)
- 2 Posts: Pop Culture (Viral moments, witty commentary)
- 1 Post: Personal / Relatable Humor (Daily struggles, sarcastic takes)

Requirements for each post:
1. Full post text (ready to copy, under 280 chars unless specified as a thread).
2. Media type: Specific image/video/meme/poll description.
3. Posting window: Best WAT (Nigeria Time) window.
4. Strategy: Type of post (Original, Reply, Quote, Thread, Poll).
5. Reasoning: Why it works for the 2025 X algorithm.

${context ? `Current Context/Trends: ${context}` : ''}

Output ONLY a JSON object with a "drafts" key containing an array of 10 objects with these keys:
"id", "category", "text", "mediaType", "postingTime", "strategy", "reasoning".

Tone: Witty, slightly sarcastic, confident, street-smart.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are a JSON-only response bot. Always output valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 3000,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content || '{"drafts": []}';
    const parsed = JSON.parse(content);
    return (parsed.drafts || []).slice(0, 10);
  } catch (error) {
    console.error('Error generating growth drafts:', error);
    throw new Error('Growth strategy generation failed. Please try again.');
  }
}
