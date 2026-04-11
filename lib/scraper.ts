import * as cheerio from 'cheerio';

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
 */
export async function getNigeriaTrends(): Promise<ScrapedTrend[]> {
  const sources = [
    {
      url: 'https://getdaytrends.com/nigeria/',
      parser: parseGetDayTrends,
      timeout: 8000,
    },
    {
      url: 'https://trends24.in/nigeria/',
      parser: parseTrends24,
      timeout: 8000,
    },
  ];

  for (const source of sources) {
    try {
      const trends = await scrapeWithTimeout(
        source.url,
        source.parser,
        source.timeout
      );
      if (trends.length >= 5) {
        return trends.slice(0, 10);
      }
    } catch (error) {
      console.error(
        `Failed to scrape ${source.url}:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

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
  const $ = cheerio.load(html);
  const seenTopics = new Set<string>();

  $('td.main a').each((_, element) => {
    const topic = $(element).text().trim();
    if (topic && !seenTopics.has(topic) && topic.length > 2 && trends.length < 10) {
      seenTopics.add(topic);
      const volume = $(element).closest('tr').find('.count').text().trim() || 'Trending';
      trends.push({ name: topic, volume });
    }
  });

  return trends;
}

function parseTrends24(html: string): ScrapedTrend[] {
  const trends: ScrapedTrend[] = [];
  const $ = cheerio.load(html);
  const seenTopics = new Set<string>();

  $('.trend-card__list li a').each((_, element) => {
    const topic = $(element).text().trim();
    if (topic && !seenTopics.has(topic) && topic.length > 2 && trends.length < 10) {
      seenTopics.add(topic);
      trends.push({ name: topic, volume: 'Trending' });
    }
  });

  return trends;
}

/**
 * Demo trends returned when all scraping fails
 */
function getDemoTrends(): ScrapedTrend[] {
  return [
    { name: 'Naija Music Vibes', volume: '50K' },
    { name: 'Nigerian Politics', volume: '120K' },
    { name: 'Afrobeats Global', volume: '85K' },
    { name: 'Lagos Entertainment', volume: 'Trending' },
    { name: 'Nigeria Tech Scene', volume: '10K' },
    { name: 'Naija Street Fashion', volume: 'Trending' },
    { name: 'Nigerian Films', volume: 'Trending' },
    { name: 'African Innovation', volume: 'Trending' },
    { name: 'Nigerian Food Culture', volume: 'Trending' },
    { name: 'Nigeria Sports Update', volume: 'Trending' },
  ];
}
