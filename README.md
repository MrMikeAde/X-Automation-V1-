# NaijaTrendBanger

**Authentic Nigerian trends transformed into viral posts in seconds.**

NaijaTrendBanger is a high-performance web application that identifies the top trending topics in Nigeria and uses the Groq LPU™ Inference Engine to craft high-engagement tweets in authentic Nigerian pidgin and street-smart commentary.

No bots. No generic AI vibes. Just fire tweets ready for your timeline.

## 🚀 Key Features

- **Real-Time Trends:** Resilient multi-source scraper (Cheerio-based) that pulls live trending topics across Nigeria.
- **Authentic Naija Persona:** Specialized prompt engineering ensures the generated content sounds like a real person, using local slang and culturally relevant context.
- **Extreme Speed:** Leverages Groq for near-instant AI inference, generating all 10 bangers in parallel.
- **Privacy-Centric:** Your API keys are stored locally in your browser (localStorage), never on a server.
- **Clean X Aesthetic:** A minimalist, high-contrast black and white UI designed for focus and ease of use.
- **Streamlined Workflow:** One-click copy for individual tweets or the entire list, with direct "Share to X" integration.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Strict Black & White Theme)
- **AI Inference:** [Groq SDK](https://groq.com/) (Mixtral-8x7b)
- **Scraping:** Cheerio
- **Icons:** Lucide React

## ⚡ Why Groq?

NaijaTrendBanger uses Groq because it is the fastest inference engine available today. For a tool meant to capture "the moment," speed is everything. Groq allows us to fetch trends and generate 10 unique, high-quality tweets in less than 2 seconds.

## 🏁 Getting Started

### Prerequisites

You need a Groq API key to generate tweets. You can get one for free at [console.groq.com](https://console.groq.com/keys).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/naija-trend-banger.git
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
5. Click the settings icon (⚙️) to save your Groq API key.

## 🌐 Deployment

This application is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Your app is live!

## 📖 How it Works

1. **Scrape:** The app fetches the latest trends from public Nigerian trend aggregators.
2. **Process:** Using Cheerio, it extracts the most relevant topics and their current engagement volume.
3. **Parallel Generation:** The topics are sent to Groq simultaneously. A specialized system prompt ensures the "Naija" tone is authentic and engaging.
4. **Display:** Trends are presented in a clean feed, ready for you to copy and post.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built for the Naija community. Powered by **Groq**.
