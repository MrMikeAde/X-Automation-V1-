# NaijaTrendBanger 🔥

A beautiful, single-page web app that fetches the 10 hottest trending topics in Nigeria from public sources and generates authentic Naija-style viral tweets using Groq AI, all in seconds.

**No bots. No X API needed. Just ready-to-copy tweets that sound like a real sharp Naija guy posting.**

## Features ✨

**Core:**
- 🔥 Fetches real-time trending topics from Nigeria (multi-source scraper with fallbacks)
- 🤖 Generates authentic Naija-style viral tweets with Groq AI
- 📱 Fully responsive dark mode UI with Naija green accents
- ⚡ Production-ready with error handling, rate limiting, and timeouts

**User Features:**
- 📋 Copy individual tweets or all at once
- 🔄 Refresh button to regenerate individual tweets without fetching new trends
- 🐦 Share tweets directly to X/Twitter with web intent
- 📊 Character counter (280 limit) with visual progress bar
- 🔐 Secure API key management with localStorage
- 💾 Demo trends fallback when scraper is down (app never breaks)

**Developer Features:**
- 🛡️ Rate limiting (10 requests/min per IP)
- ⏱️ Timeout protection on all API calls
- ✅ Input validation for API keys
- 📝 Comprehensive logging for debugging
- 🎯 Clean, maintainable TypeScript code

**Only requires Groq API key—no X/Twitter credentials needed!**

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful components
- **Groq SDK** for fast LLM inference
- **Public Web Scraping** for trending topics (no API required)
- **Lucide React** for icons

## Prerequisites

You only need **one API key**:

### Groq API Key (Free)

1. Go to [console.groq.com](https://console.groq.com/keys)
2. Sign up with your email (or log in if you have an account)
3. Create a new API key
4. Copy it and keep it safe

That's it! No X/Twitter API credentials required.

## Getting Started

### Option 1: Local Development

1. **Clone or download this project**

2. **Install dependencies:**
   ```bash
   pnpm install
   ```
   (or `npm install` / `yarn install` / `bun install`)

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

5. **Add your Groq API key:**
   - Click the Settings icon (⚙️) in the top right
   - Paste your Groq API Key
   - Click "Save Key" (stored securely in browser localStorage)

6. **Generate tweets:**
   - Click "Fetch 10 Latest Naija Trends & Generate Bangers"
   - Wait for the magic to happen
   - Copy tweets one by one and post to X/Twitter

### Option 2: Deploy to Vercel (Recommended)

**5-minute deployment with free hosting:**

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "NaijaTrendBanger"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Click "Add New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Add Environment Variable:**
   - Settings → Environment Variables
   - Key: `GROQ_API_KEY`
   - Value: `gsk_your_key_here`
   - Save

4. **Click "Deploy"**
   - Build takes 2-3 minutes
   - Get live URL like `https://naija-trend-banger.vercel.app`

5. **Test your live deployment:**
   - Open URL
   - Settings icon → paste Groq key
   - Click "Fetch Trends"

**Full guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions and troubleshooting.

4. **Optional: Add Environment Variables** for server-side defaults:
   - In your Vercel project settings, go to "Environment Variables"
   - Add `GROQ_API_KEY` if you want a default (users can still override via UI)
   - No X/Twitter credentials needed!

5. **Deploy:**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

## How It Works

### User Flow

1. **User enters Groq API key** via the Settings modal
2. **User clicks the main button** to fetch trends
3. **Backend scrapes Nigeria trends** from public web sources (no API required)
4. **For each trend, Groq generates** a natural, Naija-style tweet
5. **Results appear on screen** with:
   - Trend rank and name
   - Trending status
   - Generated tweet
   - One-click copy button
6. **User copies tweets** and posts to their X/Twitter account

### API Route: `/api/bangers`

**Endpoint:** `POST /api/bangers`

**Request Body:**
```json
{
  "groqApiKey": "your_groq_api_key"
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-04-11T15:30:00Z",
  "trends": [
    {
      "rank": 1,
      "topic": "#ARSBOU",
      "tweetVolume": "52K",
      "generatedTweet": "Bournemouth dey cook Arsenal for Emirates 😂 Who go tell these boys say today no be April Fool? Naija Arsenal fans, how una body dey? #ARSBOU"
    },
    ...
  ]
}
```

## Key Features Explained

### 🔐 Secure Key Management

- API keys are stored in browser `localStorage` only
- Keys are never sent to our servers (frontend processes them)
- Users can clear keys anytime via the Settings modal

### 🤖 Groq AI Magic

The system uses a custom Groq prompt to generate authentic Naija tweets:
- Uses proper pidgin English and slang
- Adds relevant emojis and hashtags naturally
- Sounds like a real human, not a bot
- Max 240 characters (fits X's limits)

### 🌍 Nigeria Trends API

- Uses X API v2 Trends endpoint
- Nigeria's WOEID: 23424908
- Fetches up to 20 trends and selects top 10
- Filters out crypto/finance tickers (starting with `$`)

## File Structure

```
app/
├── api/
│   └── bangers/
│       └── route.ts          # Main API route for trends + tweet generation
├── page.tsx                  # Main landing page (single file)
├── layout.tsx                # Root layout with metadata
└── globals.css               # Global styles + theme

components/
├── TrendCard.tsx             # Individual trend display card
└── ui/                       # shadcn/ui components

lib/
├── types.ts                  # TypeScript interfaces
├── groq.ts                   # Groq API integration with timeouts
├── scraper.ts                # Multi-source trend scraper
├── validation.ts             # Input validation utilities
└── rate-limiter.ts           # Rate limiting middleware
```

## Environment Variables

### For Local Development

Create a `.env.local` file:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

That's it! No other credentials needed.

### For Vercel Deployment

Add in **Settings → Environment Variables**:
- Key: `GROQ_API_KEY`
- Value: `gsk_your_key_here`

**Note:** Users can also provide their own API key via the Settings modal in the app.

## Customization

### Change the Trend Limit

Edit `/app/api/bangers/route.ts`:
```typescript
.slice(0, 10)  // Change 10 to your desired number
```

### Modify the Tweet Prompt

Edit `/lib/groq.ts` and update the `systemPrompt` variable to customize tweet style.

### Change the Color Theme

Edit `/app/globals.css` to swap the emerald green (`#00A651`) for your preferred color.

### Use a Different Groq Model

Edit `/lib/groq.ts`:
```typescript
model: 'mixtral-8x7b-32768'  // Change to mixtral-8x7b-32768 or llama3-70b-8192
```

Available models:
- `mixtral-8x7b-32768` (recommended, fastest)
- `llama-3.3-70b-versatile`

## Troubleshooting

### "Invalid Groq API key"

- API key format is wrong (must start with `gsk_`)
- Get a fresh key from [console.groq.com/keys](https://console.groq.com/keys)
- Verify key is copied completely without spaces

### "Groq request timed out"

- Groq API is slow (retry in 30 seconds)
- Network connectivity issue
- Try again after waiting

### "Trends page temporarily down"

- All scraper sources are unavailable
- App automatically falls back to demo trends
- Try again in 1-2 minutes

### "Too many requests"

- Rate limit hit (10 requests/minute per IP)
- Wait 60 seconds before retrying
- Prevents abuse and excessive API usage

### Keys not saving

- Ensure browser localStorage is enabled
- Check browser settings → Privacy & Security
- Try clearing cache and reloading

### "502 Bad Gateway" on Vercel

- Function timed out or out of memory
- Check Vercel Function Logs for details
- Verify Groq API key is valid
- Try deploying fresh version

## API Rate Limits & Quotas

- **App-level:** 10 requests/minute per IP (configurable)
- **Groq API:** Free tier rate limits vary (typically 30 req/min)
- **Scraper:** 8 second timeout per source

For details: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Security Notes

- 🔐 API keys stored safely in browser localStorage, never sent to servers
- 🔐 Groq API calls validated with format checking (gsk_* format required)
- 🔐 Rate limiting prevents abuse and quota exhaustion
- 🔐 All requests have timeout protection (Groq: 30s, Scraper: 8s)
- 🔐 Use environment variables on Vercel for server-side defaults

## Documentation Roadmap

- **[README.md](./README.md)** - Overview & getting started (this file)
- **[DEPLOY_QUICK_REFERENCE.md](./DEPLOY_QUICK_REFERENCE.md)** - Deploy in 5 minutes
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment guide
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Architecture & code details
- **[IMPROVEMENTS_INTEGRATED.md](./IMPROVEMENTS_INTEGRATED.md)** - Features added (resilience, validation, etc.)
- **[FINAL_SUMMARY.md](./FINAL_SUMMARY.md)** - Complete project overview

**TL;DR:** Start with [DEPLOY_QUICK_REFERENCE.md](./DEPLOY_QUICK_REFERENCE.md) to go live immediately.

## Contributing

Ideas for improvements:

- Support other countries' trends
- Add tweet scheduling
- Support different Groq models
- Dark/Light theme toggle
- Tweet analytics & history
- Multi-language tweet generation

## License

MIT License - free to use for personal and commercial projects.

## Credits

- Built with [Next.js 15](https://nextjs.org/)
- Powered by [Groq](https://groq.com/) for fast AI inference
- Trends from public web scraping (multi-source with fallbacks)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Made with 🔥 for Naija** - Sharp, fast, and ready to go viral.

Oya, go generate some bangers! 🚀
