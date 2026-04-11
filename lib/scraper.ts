/**
 * Public web scraping utility to fetch Nigeria trending topics
 * Multi-source scraper with timeout protection and demo data fallback
 */

export interface ScrapedTrend {
  name: string;
  volume?: string;
}

/**
 * Fetch top 10 Nigeria trending topics from public sources
 * Tries multiple sources with timeouts, falls back to demo data
 */
export async function getNigeriaTrends(): Promise<ScrapedTrend[]> {
  const sources = [
    {
      url: 'https://getdaytrends.com/nigeria/',
      parser: parseGetDayTrends,
      timeout: 8000,
    },
    {
      url: 'https://getdaytrends.com/ng/',
      parser: parseGetDayTrends,
      timeout: 8000,
    },
    {
      url: 'https://trends24.in/nigeria/',
      parser: parseTrends24,
      timeout: 8000,
    },
  ];

  // Try each source in sequence
  for (const source of sources) {
    console.log(`Attempting to scrape: ${source.url}`);
    try {
      const trends = await scrapeWithTimeout(
        source.url,
        source.parser,
        source.timeout
      );
      if (trends.length >= 5) {
        console.log(`Successfully scraped ${trends.length} trends`);
        return trends.slice(0, 10);
      }
    } catch (error) {
      console.error(
        `Failed to scrape ${source.url}:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // All sources failed, return demo data
  console.log('All scraping sources failed, using demo trends');
  return getDemoTrends();
}

async function scrapeWithTimeout(
  url: string,
  parser: (html: string) => ScrapedTrend[],
  timeoutMs: number
): Promise<ScrapedTrend[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return parser(html);
  } finally {
    clearTimeout(timeout);
  }
}

function parseGetDayTrends(html: string): ScrapedTrend[] {
  const trends: ScrapedTrend[] = [];
  const seenTopics = new Set<string>();

  try {
    // Match trend links in getdaytrends format
    const trendRegex =
      /<a\s+href="[^"]*trend[^"]*"[^>]*>([^<]+)<\/a>/gi;
    let match;

    while ((match = trendRegex.exec(html)) !== null && trends.length < 10) {
      const topic = decodeHtmlEntities(match[1].trim());

      // Skip empty or very short topics, avoid duplicates
      if (topic && !seenTopics.has(topic) && topic.length > 2) {
        seenTopics.add(topic);
        trends.push({
          name: topic,
          volume: 'Trending',
        });
      }
    }

    return trends;
  } catch (error) {
    console.error('Error parsing GetDayTrends format:', error);
    return [];
  }
}

function parseTrends24(html: string): ScrapedTrend[] {
  const trends: ScrapedTrend[] = [];
  const seenTopics = new Set<string>();

  try {
    // Match trend items in trends24 format
    const trendRegex = /<a[^>]*href="[^"]*trend[^"]*"[^>]*>([^<]+)<\/a>/gi;
    let match;

    while ((match = trendRegex.exec(html)) !== null && trends.length < 10) {
      const topic = decodeHtmlEntities(match[1].trim());

      if (topic && !seenTopics.has(topic) && topic.length > 2) {
        seenTopics.add(topic);
        trends.push({
          name: topic,
          volume: 'Trending',
        });
      }
    }

    return trends;
  } catch (error) {
    console.error('Error parsing Trends24 format:', error);
    return [];
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x[0-9a-fA-F]+;/g, (match) => {
      return String.fromCharCode(
        parseInt(match.substring(3, match.length - 1), 16)
      );
    });
}

/**
 * Demo trends returned when all scraping fails
 * App still fully functional for demo/testing
 */
function getDemoTrends(): ScrapedTrend[] {
  return [
    { name: 'Naija Music Vibes', volume: 'Trending' },
    { name: 'Nigerian Politics', volume: 'Trending' },
    { name: 'Afrobeats Global', volume: 'Trending' },
    { name: 'Lagos Entertainment', volume: 'Trending' },
    { name: 'Nigeria Tech Scene', volume: 'Trending' },
    { name: 'Naija Street Fashion', volume: 'Trending' },
    { name: 'Nigerian Films', volume: 'Trending' },
    { name: 'African Innovation', volume: 'Trending' },
    { name: 'Nigerian Food Culture', volume: 'Trending' },
    { name: 'Nigeria Sports Update', volume: 'Trending' },
  ];
}
