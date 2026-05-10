import * as cheerio from 'cheerio';

/**
 * Public web scraping utility to fetch Worldwide trending topics
 * Multi-source scraper with timeout protection and demo data fallback
 */

export interface ScrapedTrend {
  name: string;
  volume?: string;
}

/**
 * Fetch top 10 Worldwide trending topics from public sources
 */
export async function getWorldwideTrends(): Promise<ScrapedTrend[]> {
  const sources = [
    {
      url: 'https://getdaytrends.com/',
      parser: parseGetDayTrends,
      timeout: 3000,
    },
    {
      url: 'https://trends24.in/',
      parser: parseTrends24,
      timeout: 3000,
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

  // Improved selection logic for better reliability
  $('td.main a, .trend-name a').each((_, element) => {
    const topic = $(element).text().trim();
    // Basic validation: length > 2 and not already seen
    if (topic && !seenTopics.has(topic) && topic.length > 1 && trends.length < 10) {
      seenTopics.add(topic);
      // Try multiple ways to find volume
      const volume =
        $(element).closest('tr').find('.count').text().trim() ||
        $(element).closest('tr').find('.volume').text().trim() ||
        'Trending';
      trends.push({ name: topic, volume });
    }
  });

  return trends;
}

function parseTrends24(html: string): ScrapedTrend[] {
  const trends: ScrapedTrend[] = [];
  const $ = cheerio.load(html);
  const seenTopics = new Set<string>();

  // Improved selection logic
  $('.trend-card__list li a, .trend-list li a').each((_, element) => {
    const topic = $(element).text().trim();
    if (topic && !seenTopics.has(topic) && topic.length > 1 && trends.length < 10) {
      seenTopics.add(topic);
      const volume = $(element).siblings('.tweet-count').text().trim() || 'Trending';
      trends.push({ name: topic, volume });
    }
  });

  return trends;
}

/**
 * Demo trends returned when all scraping fails
 * Updated to Global Edition
 */
function getDemoTrends(): ScrapedTrend[] {
  return [
    { name: 'Global Tech Summit', volume: '250K' },
    { name: 'Future of AI', volume: '1.2M' },
    { name: 'Sustainable Energy', volume: '85K' },
    { name: 'Space Exploration', volume: 'Trending' },
    { name: 'Digital Nomad Life', volume: '15K' },
    { name: 'Modern Stoicism', volume: 'Trending' },
    { name: 'Global Economy', volume: 'Trending' },
    { name: 'Mental Health Awareness', volume: 'Trending' },
    { name: 'Cybersecurity 2024', volume: 'Trending' },
    { name: 'Universal Healthcare', volume: 'Trending' },
  ];
}
