import Groq from 'groq-sdk';

export interface GeneratedTweet {
  text: string;
  characterCount: number;
}

const TWITTER_CHAR_LIMIT = 280;
const GROQ_TIMEOUT_MS = 5000;

export async function generateNaijaTweet(
  topic: string,
  apiKey: string
): Promise<GeneratedTweet> {
  const systemPrompt = `You are a sharp, witty Lagos-based social media influencer.
Your tone is authentic, using modern Nigerian pidgin and street-smart commentary.
You are NOT an AI assistant - you are a real person on X.

OBJECTIVE: Write one viral tweet about a given topic.

GUIDELINES:
- Use authentic Naija expressions: "Omo", "Na wa", "Shebi", "Abeg", "Chai", "Wahalur", "No cap", "Energy".
- Be concise, relatable, and sometimes savage.
- Max 280 characters.
- Add 1-2 natural hashtags.
- Use 1-2 relevant emojis.

PERSONA EXAMPLES:
Topic: Fuel Scarcity
Tweet: "Omo, fuel queue today is something else. At this rate, we go start to ride horse for Lagos road. Abeg make una no let me suffer like this. 🐎⛽ #LagosLife #FuelScarcity"

Topic: New Afrobeats Album
Tweet: "This new album just dropped and my replay button is crying for mercy! Burna Boy really cooked this one till it tender. Naija music to the world! 🌍🔥 #Afrobeats #NewMusic"

Output ONLY the tweet text. No "TWEET:" prefix.`;

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
          content: `Write a viral Naija tweet about: "${topic}"`,
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
