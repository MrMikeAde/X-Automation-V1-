/**
 * Simple in-memory rate limiter
 * Tracks requests per IP address
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Store rate limit data in memory (window: 1 minute)
const rateLimitMap = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

/**
 * Check if request from IP should be rate limited
 * Returns true if allowed, false if rate limited
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Create new entry if doesn't exist
  if (!entry) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetIn: WINDOW_MS,
    };
  }

  // Check if window has expired
  if (now >= entry.resetTime) {
    // Reset the window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetIn: WINDOW_MS,
    };
  }

  // Increment count
  entry.count++;
  const allowed = entry.count <= MAX_REQUESTS_PER_WINDOW;
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - entry.count);
  const resetIn = entry.resetTime - now;

  return {
    allowed,
    remaining,
    resetIn,
  };
}

/**
 * Get IP from request headers
 */
export function getIpFromRequest(request: Request): string {
  // Try to get from CF headers first (Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // Try x-forwarded-for (common proxy header)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  // Fallback to x-real-ip
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  // Fallback to generic remote address
  return request.headers.get('remote-addr') || 'unknown';
}

/**
 * Cleanup old entries from map periodically
 * Call this occasionally to prevent memory bloat
 */
export function cleanupOldEntries(): void {
  const now = Date.now();
  const entriesToDelete: string[] = [];

  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now >= entry.resetTime + WINDOW_MS) {
      entriesToDelete.push(ip);
    }
  }

  entriesToDelete.forEach((ip) => rateLimitMap.delete(ip));

  if (entriesToDelete.length > 0) {
    console.log(`Cleaned up ${entriesToDelete.length} rate limit entries`);
  }
}
