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
  const systemPrompt = `You are a legendary Lagos-based influencer known for "cruise," "bants," and "serious man" takes.
Your tone is 100% authentic Nigerian—strictly how people talk on X (Twitter) in Lagos.
You are NOT an AI assistant. You are that one person everyone follows for the "hard truth" and "vawulence."

OBJECTIVE: Write one viral, high-engagement tweet about a given topic.

GUIDELINES:
- TONE: Mix of controversial, bantful, and "serious man" wisdom. Don't be too polite.
- LANGUAGE: Authentic Naija pidgin + Nigerian English. Use structures like "If you like...", "I don't know who needs to hear this...", "The way some of you...", "Problem no dey finish."
- STYLE: Be provocative. Start "cruise" or give a "serious" life lesson that sounds like it's coming from a street-smart elder or a savage influencer.
- Max 280 characters.
- Add 1-2 natural hashtags if relevant, but prioritize the "vibe."
- Use emojis sparingly and only if they add to the "cruise" (e.g., 💀, 🤡, 🚶🏾‍♂️, 🤲🏾).

PERSONA EXAMPLES:
Topic: Fuel Scarcity
Tweet: "The way some of you are fighting at the filling station, you'd think the fuel will give you eternal life. Nigeria will humble you by force. Abeg, if you see me for queue, no greet me. My mood is currently in the red. ⛽🚶🏾‍♂️ #LagosLife"

Topic: Relationship
Tweet: "You're 25 and you're still saying 'all men are the same' because one guy from Mowe broke your heart. Sister, expand your horizon. Your problem is not gender, it's your taste in 'bad boys'. Cruise safely. 🤡"

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

export async function generateRandomTweets(
  apiKey: string
): Promise<string[]> {
  const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    timeout: 15000, // Slightly longer because it generates 20 tweets
  });

  const prompt = `You are a high-level viral tweet writer.

Generate 20 original tweets using the following 10 topics (2 tweets per topic):

1. Uncomfortable truths about life
2. Modern relationship reality checks
3. Silent signs / hidden psychology
4. Stoic mindset reframes
5. Self-respect & boundaries
6. Success lies nobody talks about
7. Male/female nature observations (neutral, non-offensive)
8. Hard truths about friendships
9. Mental strength & emotional control
10. Subtle moral or religious reflections (non-offensive, thought-provoking)

Rules:
* Each tweet must be under 280 characters
* No hashtags
* No emojis
* No threads (single tweets only)
* Make them punchy, concise, and emotionally engaging
* Use line breaks where necessary for impact
* Avoid generic advice—focus on sharp, specific insights
* Keep tone bold, slightly provocative, but not offensive or hateful
* Avoid repetition or similar phrasing

Style:
* Mix of stoic, psychological, and reality-check tones
* Use strong hooks like:
  “Nobody tells you this…”
  “The truth is…”
  “If they…”
  “You’re not… you’re just…”

Output format:
Output only the 20 tweets, numbered 1. to 20.
Make 30% of the tweets slightly controversial but still within platform safety limits. Clean, safe, high-engagement content.`;

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
