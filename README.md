# NaijaTrendBanger

Authentic Nigerian trends transformed into viral posts in seconds.

NaijaTrendBanger identifies the top 10 trending topics in Nigeria and uses Groq AI to craft high-engagement tweets in authentic Nigerian pidgin and street-smart commentary.

No bots. No complicated setup. Just fire tweets ready for your timeline.

## Features

- **Real-Time Trends:** Fetches live trending topics across Nigeria using a resilient multi-source scraper.
- **Authentic Voice:** Generates tweets that sound like a real person, using local slang and culturally relevant context.
- **High Performance:** Powered by Groq for near-instant AI inference.
- **Privacy First:** Your API keys are stored locally in your browser, never on a server.
- **Streamlined Workflow:** One-click copy for individual tweets or the entire list.
- **Direct Sharing:** Post straight to X with built-in web intent support.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Strict Black & White Theme)
- **AI:** Groq SDK (Mixtral)
- **Scraping:** Cheerio
- **Icons:** Lucide React

## Getting Started

### Prerequisites

You need a Groq API key to generate tweets. You can get one for free at [console.groq.com](https://console.groq.com/keys).

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
5. Click the settings icon to save your Groq API key.

## Deployment

This application is ready to be deployed on Vercel or any other Next.js compatible hosting provider.

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Deploy.

## How it Works

1. **Scrape:** The app fetches the latest trends from public Nigerian trend aggregators.
2. **Process:** Using Cheerio, it extracts the most relevant topics and their engagement volume.
3. **Generate:** The topics are sent to Groq with a specialized system prompt to ensure authentic "Naija" tone and style.
4. **Display:** Trends are presented in a clean, minimalist feed for easy review and copying.

---

Built for the Naija community. Powered by Groq.
