# Project Structure 📁

A complete guide to understanding the NaijaTrendBanger codebase.

## Directory Tree

```
naijatrend-banger/
├── app/                          # Next.js app directory (App Router)
│   ├── api/
│   │   └── bangers/
│   │       └── route.ts          # POST endpoint for fetching trends & generating tweets
│   ├── page.tsx                  # Main landing page (everything in one file)
│   ├── layout.tsx                # Root layout with metadata and fonts
│   └── globals.css               # Global styles, theme, design tokens
│
├── components/
│   ├── TrendCard.tsx             # Individual trend card component
│   └── ui/                       # shadcn/ui pre-built components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       └── ... (other shadcn components)
│
├── lib/                          # Shared utilities and logic
│   ├── types.ts                  # TypeScript interfaces and types
│   ├── groq.ts                   # Groq AI integration
│   ├── x-api.ts                  # X (Twitter) API integration
│   └── utils.ts                  # Helper functions (cn, etc.)
│
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── styles/
│   └── globals.css               # Legacy styles (not used, use app/globals.css)
│
├── public/                       # Static assets (favicons, etc.)
│   ├── icon.svg
│   ├── icon-dark-32x32.png
│   └── icon-light-32x32.png
│
├── node_modules/                 # Dependencies (auto-installed)
│
├── Documentation Files
│   ├── README.md                 # Main documentation
│   ├── QUICKSTART.md             # 5-minute quick start guide
│   ├── API_SETUP.md              # Detailed API key setup instructions
│   └── PROJECT_STRUCTURE.md      # This file
│
├── Configuration Files
│   ├── .env.example              # Example environment variables
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.ts         # Tailwind CSS configuration
│   ├── next.config.mjs           # Next.js configuration
│   ├── components.json           # shadcn/ui configuration
│   └── postcss.config.mjs        # PostCSS configuration
│
└── .gitignore                    # Files to ignore in Git
```

---

## Key Files Explained

### `app/page.tsx` - Main Landing Page
**Purpose:** The entire user interface and app logic

**What it does:**
- Displays hero section with app title and description
- Manages API key input via Settings modal
- Handles "Fetch Trends" button click
- Displays loading state with fun Naija slang
- Shows error messages if something goes wrong
- Renders list of trend cards with generated tweets
- Shows copy-to-clipboard functionality

**Key Features:**
- 100% client-side (after initial page load)
- Uses React hooks for state management
- Stores API keys in browser localStorage
- Calls `/api/bangers` endpoint to fetch and generate tweets
- Shows toast notifications for user feedback

**If you want to customize:**
- Change loading message (line ~125)
- Modify hero text (line ~104-106)
- Adjust colors/styling (Tailwind classes)
- Change card layout (line ~242)

---

### `app/api/bangers/route.ts` - Backend API
**Purpose:** Fetch trends from X API and generate tweets with Groq

**What it does:**
1. Receives POST request with user's API keys
2. Calls X Trends API for Nigeria (WOEID: 23424908)
3. Filters to top 10 trends
4. For each trend, calls Groq to generate a Naija-style tweet
5. Returns JSON with all trends and generated tweets

**Request:**
```json
{
  "groqApiKey": "gsk_xxx",
  "xBearerToken": "AAAAA_xxx"
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
      "generatedTweet": "Your generated tweet here..."
    }
  ]
}
```

**Error Handling:**
- Invalid API keys → Returns 400/500 with error message
- X API failure → Caught and returns error
- Groq failure → Continues with next trend (resilient)

---

### `lib/types.ts` - Type Definitions
**Purpose:** TypeScript interfaces for type safety

**Key Types:**
- `Trend` - Individual trend with tweet
- `BangersResponse` - API response format
- `BangersRequest` - API request format

---

### `lib/groq.ts` - Groq AI Integration
**Purpose:** Generate authentic Naija tweets using Groq

**Main Function:** `generateNaijaTweet(topic, apiKey)`

**What it does:**
1. Creates Groq client with user's API key
2. Sends prompt asking for Naija-style tweet about the topic
3. Parses response to extract the generated tweet
4. Returns tweet as string

**The System Prompt:**
- Tells Groq to act like a real Naija guy posting on Twitter
- Uses pidgin English and slang
- Limits to 240 characters
- Asks for 1-2 hashtags naturally
- Emphasizes sounding human, not like AI

**If you want to customize:**
- Edit the `systemPrompt` variable (line ~8-23)
- Change Groq model (line ~36): `mixtral-8x7b-32768` → `llama-3.3-70b-versatile`
- Adjust `max_tokens` (line ~34) for longer/shorter tweets

---

### `lib/x-api.ts` - X (Twitter) API Integration
**Purpose:** Fetch trending topics in Nigeria

**Main Function:** `getNigeriaTrends(bearerToken)`

**What it does:**
1. Calls X Trends API endpoint
2. Uses Nigeria's WOEID: 23424908
3. Fetches up to 20 trends
4. Filters out ticker symbols (starts with `$`)
5. Returns top 10 as array

**Endpoint Used:**
```
https://api.x.com/2/trends/by/woeid/23424908?max_results=20
```

**If you want to customize:**
- Change country: Replace WOEID `23424908` with another country's WOEID
- Change trend limit: Modify `.slice(0, 10)` (line ~38)
- Add filtering: Filter by keywords or exclude certain topics

---

### `components/TrendCard.tsx` - Trend Display Component
**Purpose:** Display a single trend with generated tweet

**What it does:**
- Shows trend rank in colored box
- Displays trend name and tweet volume
- Shows generated tweet in highlighted box
- Provides "Copy Tweet" button
- Shows "Copied!" confirmation when clicked

**Props:**
```typescript
interface TrendCardProps {
  trend: Trend;
  onCopied?: () => void;  // Called when user copies
}
```

**If you want to customize:**
- Change card colors (Tailwind classes)
- Modify layout (use grid/flex differently)
- Add more metadata (views, engagement, etc.)
- Add buttons (Tweet, Retweet, Like, etc.)

---

### `app/layout.tsx` - Root Layout
**Purpose:** HTML wrapper and metadata for all pages

**Key Content:**
- Page title: "NaijaTrendBanger 🔥"
- Page description (for SEO)
- Font imports (Geist Sans & Mono)
- Google Analytics (in production)

**If you want to customize:**
- Change title/description
- Add different fonts
- Add custom fonts from Google Fonts
- Add scripts (tracking, analytics, etc.)

---

### `app/globals.css` - Global Styles
**Purpose:** Design tokens, theme, and global CSS

**Contains:**
- CSS variables (--primary, --background, etc.)
- Dark mode theme configuration
- Tailwind directives (@layer, @theme)
- Custom font definitions

**Design System:**
- Uses oklch() color space (modern, perceptually uniform)
- 5 color variables for charts
- Radius token for consistent border-radius
- Sidebar-specific theme variables (unused, from template)

**If you want to customize:**
- Change primary color (search `#00A651` equivalent)
- Modify dark/light theme colors
- Adjust border radius
- Add new CSS variables

---

## Data Flow

### Fetching Trends and Generating Tweets

```
User clicks "Fetch Trends" button
    ↓
Page.tsx calls /api/bangers POST endpoint
    ↓
Backend (route.ts) receives groqApiKey & xBearerToken
    ↓
Calls x-api.ts → getNigeriaTrends(token)
    ├→ X API returns top 20 Nigeria trends
    └→ Filter to top 10
    ↓
For each trend, calls groq.ts → generateNaijaTweet(topic, apiKey)
    ├→ Groq API generates Naija-style tweet
    └→ Handle errors gracefully (continue if one fails)
    ↓
Backend returns JSON with all trends and tweets
    ↓
Page.tsx receives response
    ↓
Updates state with trends
    ↓
Re-renders with TrendCard components
    ↓
User sees 10 trends with tweets ready to copy
```

---

## Technologies Used

### Frontend
- **React 19.2.4** - UI framework
- **Next.js 16** - React meta-framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Pre-built components
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Serverless functions
- **Groq SDK** - AI integration
- **Fetch API** - HTTP requests

### Tools
- **pnpm** - Package manager
- **PostCSS** - CSS processing
- **Tailwind CSS** - Utility-first CSS

---

## Environment Variables

### For Development (`.env.local`)
```env
# Optional - set defaults for development
X_BEARER_TOKEN=your_token_here
GROQ_API_KEY=your_key_here
```

### For Production (Vercel)
Set in Vercel project settings → Environment Variables:
- `X_BEARER_TOKEN`
- `GROQ_API_KEY`

Users can override via Settings modal in the app.

---

## Common Tasks & Where to Edit

| Task | File(s) | What to Change |
|------|---------|---|
| Change app name/title | `app/layout.tsx` | metadata.title |
| Change colors | `app/globals.css` | CSS variables or Tailwind colors |
| Customize tweet prompt | `lib/groq.ts` | systemPrompt variable |
| Change Groq model | `lib/groq.ts` | model property |
| Support different country | `lib/x-api.ts` | WOEID constant |
| Add more/fewer trends | `lib/x-api.ts` | .slice(0, 10) |
| Modify UI layout | `app/page.tsx` | Tailwind classes |
| Change card design | `components/TrendCard.tsx` | Component JSX |
| Add loading animation | `app/page.tsx` | RotateCw component |
| Change toast messages | `app/page.tsx` | showToast() calls |

---

## Development Workflow

1. **Edit a file**
   - Change code in any `.tsx`, `.ts`, or `.css` file
   
2. **Hot Module Replacement (HMR)**
   - Save the file
   - Preview auto-updates without full page reload
   - Check console for errors

3. **Test API calls**
   - Check browser DevTools → Network tab
   - Look for `/api/bangers` POST requests
   - Inspect request/response payloads

4. **Debug state**
   - Add `console.log()` statements in React components
   - View output in browser console
   - State updates visible in React DevTools

---

## Deployment Checklist

- [ ] All API keys configured (in Vercel env vars or user provides via UI)
- [ ] README and QUICKSTART.md in place
- [ ] .env.example has clear instructions
- [ ] No console errors in preview
- [ ] All features working:
  - [ ] Settings modal opens
  - [ ] Keys save/clear
  - [ ] Fetch trends button works
  - [ ] Tweets generate correctly
  - [ ] Copy button works
  - [ ] Responsive on mobile
- [ ] Error handling works:
  - [ ] Invalid API key shows error
  - [ ] Network errors handled gracefully
  - [ ] Rate limits handled

---

## Troubleshooting Development

| Issue | Solution |
|-------|----------|
| Changes not reflecting | Clear browser cache, hard refresh (Ctrl+Shift+R) |
| TypeScript errors | Check imports are correct, run `tsc --noEmit` |
| API calls failing | Check network tab in DevTools, verify API keys |
| Styling looks wrong | Check if Tailwind is building correctly |
| Components missing | Verify shadcn/ui components are imported from `@/components/ui/` |
| localStorage not working | Check browser privacy settings, try incognito mode |

---

## Next Steps

- Read `README.md` for full documentation
- Read `QUICKSTART.md` for user-friendly quick start
- Read `API_SETUP.md` for detailed API key instructions
- Check `package.json` for all dependencies
- Explore `app/page.tsx` to understand the main logic

---

**Happy coding!** 🚀
