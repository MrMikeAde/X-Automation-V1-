# Implementation Guide - NaijaTrendBanger v2

## Overview

This guide explains all the improvements made and how they work together to create a robust, production-ready tweet generation application.

---

## Architecture & Data Flow

```
User Input (Groq API Key)
        ↓
   [Validation]
        ↓
[Rate Limiting Check]
        ↓
[Fetch Trends] ← (With 3 backup sources + timeouts)
        ↓
[Generate Tweets] ← (Enhanced prompt + 30s timeout)
        ↓
[Display Results] ← (With refresh, copy, share options)
        ↓
[Per-Trend Refresh] ← (Individual tweet regeneration)
```

---

## Key Improvements Explained

### 1. Multi-Source Scraper Strategy

**Problem**: Single scraper source → single point of failure

**Solution**: 
```
Try getdaytrends.com (primary)
  → Success? Return trends
  → Fail? Try getdaytrends.com/ng/ (backup 1)
    → Fail? Try trends24.in (backup 2)
      → Fail? Return demo trends (graceful fallback)
```

Each source has its own parser strategy and 8-second timeout.

**File**: `lib/scraper.ts` (145 lines)

---

### 2. Enhanced Groq Integration

**Problem**: Generic tweets didn't sound "Naija enough"

**Solution**: 
- System prompt now includes 3 viral tweet examples
- Explicit list of Naija slang to use (Omo, Na wa, Shebi, etc.)
- Mood selector (savage/funny/relatable/hype)
- Character limit enforcement with auto-truncation
- Rich error messages distinguishing:
  - Timeout (30s cap)
  - Auth errors (invalid key)
  - Rate limiting (Groq quota)

**File**: `lib/groq.ts` (120 lines)

---

### 3. Request Validation Pipeline

```
Request arrives
  → [Check Rate Limit] (10/min per IP)
  → [Extract API Key] 
  → [Validate Key Format] (must start with gsk_)
  → [Check Key Length] (min 20 chars)
  → [Proceed to Groq]
```

**Files**: 
- `lib/validation.ts` - Format checking
- `lib/rate-limiter.ts` - IP-based limiting
- `app/api/bangers/route.ts` - Pipeline orchestration

---

### 4. Refresh Endpoint for Single Trends

New POST `/api/bangers/refresh` endpoint:

```
User clicks refresh on one trend
  → Send trend topic + Groq key
  → Generate new tweet for that topic only
  → Update card with new tweet + char count
  → All validation/rate limiting applies
```

**Use case**: User wants alternative version of a tweet without regenerating all 10.

**File**: `app/api/bangers/refresh/route.ts` (111 lines)

---

### 5. Frontend UX Enhancements

**TrendCard Component** now includes:

```
┌─ Trend #3: Nigerian Politics ────────────┐
│                                          │
│ Generated tweet text here...             │
│                                          │
│ [Characters: 245/280 ████████░░░░░░░░] │
│                                          │
│ [Copy] [Refresh] [Post to X]             │
└──────────────────────────────────────────┘
```

**Features**:
- Real-time character counter with visual bar
- Refresh button (regenerate this tweet only)
- Post to X button (opens Twitter web intent)
- Copy button (still available)
- Loading states on refresh

**Page Header** now includes:
- "Copy All" button (combines all tweets into single clipboard item)

**File**: `components/TrendCard.tsx` (250+ lines)

---

## Error Handling Strategy

### Layer 1: Input Validation
```javascript
if (!groqApiKey) → "API key required"
if (key.length < 20) → "API key too short"
if (!key.startsWith('gsk_')) → "Invalid Groq key format"
```

### Layer 2: Rate Limiting
```javascript
if (requestsInLastMinute > 10) → 
  "Too many requests. Retry in Xs"
```

### Layer 3: Network/Timeout
```javascript
if (timeout > 30s) → "Groq took too long. Check API key"
if (timeout > 8s scraper) → Use demo trends
```

### Layer 4: API Errors
```javascript
if (401 Unauthorized) → "Invalid Groq API key"
if (429 Rate Limited) → "Groq rate limiting you"
if (500+ Server Error) → "Groq servers down. Try again"
```

All errors flow back to user with actionable messages.

---

## Rate Limiting Details

**Configuration**: 10 requests per 60-second rolling window

**Per IP Tracking**:
```javascript
{
  "192.168.1.1": {
    count: 7,
    resetTime: 1681234567890
  }
}
```

**Cleanup**: Triggered ~10% of requests to remove expired entries

**Response Headers** (on rate limit):
```
429 Too Many Requests
{
  "error": "Too many requests. Retry in 42 seconds."
}
```

---

## Character Counting & Display

**Default limit**: 280 characters (Twitter/X standard)

**Status Indicators**:
- Green (0-280): "✓ Safe to post"
- Red (>280): "Over limit - auto-truncated"

**Implementation**:
- Groq returns tweet + character count
- Frontend displays real-time counter
- Visual progress bar updates on refresh

---

## Logging Strategy

All logs prefixed with `[v0]` for easy filtering:

```javascript
console.log("[v0] Successfully scraped 10 trends")
console.error("[v0] Failed to generate tweet for Lagos:", errorMsg)
console.error("[v0] Groq request timed out after 30s")
```

**Debug tips**:
- Filter logs: `grep "[v0]"`
- Watch file: `tail -f logs.txt | grep "[v0]"`
- Browser DevTools: Search console for `[v0]`

---

## Deployment Checklist

### Pre-Deploy
- [ ] Test with invalid Groq key (should show auth error)
- [ ] Test rate limiting (hit endpoint 11+ times fast)
- [ ] Test refresh button on individual trends
- [ ] Test "Copy All" functionality
- [ ] Test "Post to X" opens Twitter with tweet
- [ ] Verify character counter updates on refresh
- [ ] Check demo trends appear when scraper fails

### Vercel Deployment
- [ ] Set environment variable: `GROQ_API_KEY` (optional, for server-side default)
- [ ] All other features work without env vars (client-provided keys work)
- [ ] Check logs for any `[v0]` errors

### Post-Deploy
- [ ] Monitor rate limiting logs for abuse
- [ ] Check Groq API quota usage
- [ ] Review error logs for new failure modes
- [ ] Get user feedback on tweet quality

---

## Performance Metrics to Monitor

| Metric | Target | How to Check |
|--------|--------|-------------|
| Groq response time | <5s avg | Check browser DevTools Network tab |
| Scraper response time | <3s avg | Check API response time |
| Character count accuracy | 100% | Compare tweet length vs display |
| Rate limit enforcement | Exact | Count requests and verify 429 after 10 |
| Error message clarity | High | Test all error paths manually |
| Demo fallback reliability | 100% | Offline scraper, should show demo |

---

## Common Issues & Troubleshooting

### Issue: "Invalid Groq API Key" error
**Causes**:
- Key doesn't start with `gsk_`
- Key is too short (min 20 chars)
- Key format incorrect

**Fix**: Go to Settings, paste full key from console.groq.com/keys

### Issue: "Too many requests" after 10 tries
**Expected behavior** - Rate limiting is working!

**Fix**: Wait 60 seconds before trying again

### Issue: Character counter shows >280
**Should not happen** - Groq auto-truncates

**If it occurs**: Refresh the tweet, should fix it

### Issue: Refresh button stuck on "Cooking..."
**Cause**: Groq taking >30 seconds

**Fix**: Refresh page, try again, or check Groq API status

### Issue: Demo trends showing instead of real trends
**Cause**: Scraper sources down (maintenance/blocking)

**Expected**: App still fully functional with demo data

**Note**: Real trends will resume when sources are back

---

## Future Enhancement Ideas

1. **Tweet History**: Store generated tweets in localStorage
2. **Custom Prompts**: Let users modify the system prompt
3. **Trending Analytics**: Track which topics generate best tweets
4. **Bulk Export**: Download all tweets as CSV/JSON
5. **Tweet Scheduling**: Integration with Twitter API to auto-post
6. **Multi-language**: Generate tweets in Pidgin + Standard English
7. **Custom Hashtags**: User-defined hashtags per trend
8. **Feedback Loop**: Rate tweets (good/bad) to improve future generation

---

## Code Quality Notes

### TypeScript Coverage
- Full type safety with interfaces for all major types
- No `any` types used

### Error Handling
- Try-catch blocks at API boundaries
- Graceful fallbacks (demo data when scraper fails)
- User-friendly error messages

### Performance
- Requests are timeouts-protected
- Rate limiting prevents abuse
- Minimal state management (no Redux/Context needed)

### Security
- API keys validated before use
- No hardcoded credentials
- Rate limiting prevents brute force
- Input sanitization on tweet generation

---

## Support & Debugging

### Enable Verbose Logging
```javascript
// In development, check browser console
// Look for all [v0] prefixed messages
```

### Check Groq API Status
- https://status.groq.com

### Monitor Usage
- https://console.groq.com/usage (check API quota)

### Test Endpoints Locally
```bash
curl -X POST http://localhost:3000/api/bangers \
  -H "Content-Type: application/json" \
  -d '{"groqApiKey":"your_key_here"}'
```

---

## Summary

NaijaTrendBanger v2 is now:
- ✓ Resilient (multiple scrapers + demo fallback)
- ✓ Fast (timeouts prevent hangs)
- ✓ Safe (rate limiting + validation)
- ✓ User-friendly (clear errors + rich UX)
- ✓ Scalable (can handle traffic spikes)
- ✓ Maintainable (structured code + good logging)
- ✓ Production-ready (all edge cases handled)

Ship it with confidence!
