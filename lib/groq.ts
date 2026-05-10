import Groq from 'groq-sdk';

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
