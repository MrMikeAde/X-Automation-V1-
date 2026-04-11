import Groq from 'groq-sdk';

export interface GeneratedTweet {
  text: string;
  characterCount: number;
}

const TWITTER_CHAR_LIMIT = 280;
const GROQ_TIMEOUT_MS = 30000; // 30 second timeout

export async function generateNaijaTweet(
  topic: string,
  apiKey: string
): Promise<GeneratedTweet> {
  const systemPrompt = `You are a sharp, funny, real Naija guy from Lagos who posts on Twitter/X every day.
You use authentic Nigerian pidgin, street slang, relevant emojis, and energy that catches attention.
NEVER sound robotic or like an AI - sound like a real, witty Lagos person.

RULES:
1. Write ONE viral tweet about the topic (MUST be under 280 characters)
2. Use real Naija expressions: "Omo", "Na wa", "Shebi", "Abeg", "Chai", etc.
3. Be savage, funny, relatable, or hype - pick one mood
4. Add 1-2 hashtags naturally (e.g., #NaijaTwitter #Lagos)
5. Include 1-2 relevant emojis that fit the vibe
6. If topic is serious, be witty not offensive
7. If topic is casual, lean into humor

EXAMPLES OF VIRAL NAIJA TWEETS:
- "Lagos traffic really be testing my patience today... Omo my head don scatter. Na God go rescue us all. #LagosTraffic"
- "Nigerian music hitting different this year. We're feeding the whole world with Afrobeats. Shebi una see wetin we create? 🔥 #NaijaMusic"
- "When you discover a new Nigerian jollof spot in your area. Life just got interesting. Chai! #NaijaFoodie"

Output ONLY this format, nothing else:
TWEET: [your complete tweet here - max 280 characters]`;

  const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    timeout: GROQ_TIMEOUT_MS,
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Generate a viral Naija tweet about: "${topic}"`,
        },
      ],
      system: systemPrompt,
    } as any);

    clearTimeout(timeout);

    // Extract and validate the tweet
    const content = message.content[0];
    if (content.type === 'text') {
      let tweet = content.text.trim();
      
      // Extract from TWEET: format if present
      const match = tweet.match(/TWEET:\s*(.+?)(?=\n|$)/s);
      if (match) {
        tweet = match[1].trim();
      }

      // Truncate if exceeds limit
      if (tweet.length > TWITTER_CHAR_LIMIT) {
        tweet = tweet.substring(0, TWITTER_CHAR_LIMIT - 3) + '...';
      }

      return {
        text: tweet,
        characterCount: tweet.length,
      };
    }

    throw new Error('Unexpected response format from Groq');
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('[v0] Error generating tweet:', errorMsg);
    
    // Check for timeout
    if (
      errorMsg.includes('AbortError') ||
      errorMsg.includes('timeout') ||
      errorMsg.includes('TimeoutError')
    ) {
      throw new Error(
        'Groq request timed out. Try again in a moment or check your API key.'
      );
    }

    // Check for auth errors
    if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
      throw new Error(
        'Invalid Groq API key. Check your settings and try again.'
      );
    }

    // Check for rate limiting
    if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
      throw new Error(
        'Too many requests. Groq is rate limiting us. Try again in a minute.'
      );
    }

    throw new Error(`Failed to generate tweet: ${errorMsg}`);
  }
}
