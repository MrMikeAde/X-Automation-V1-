# Quick Start Guide 🚀

Get NaijaTrendBanger running in **5 minutes**.

## Step 1: Get Your API Keys (5 minutes)

### Groq API Key
1. Go to https://console.groq.com/keys
2. Click "Create API Key"
3. Copy the key (starts with `gsk_`)
4. **Save it somewhere safe**

### X (Twitter) Bearer Token
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Click "Create Project" (if you don't have one)
3. Fill in the details
4. Go to "Keys and Tokens"
5. Generate a "Bearer Token" (starts with `AAAAA...`)
6. **Copy and save it**

## Step 2: Run the App

### On Your Computer

```bash
# Clone or download this project
cd naijatrend-banger

# Install dependencies
pnpm install
# (or: npm install / yarn install / bun install)

# Start the dev server
pnpm dev

# Open http://localhost:3000 in your browser
```

### On Vercel (Free)

1. Push this project to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repository
5. Click "Deploy"
6. Your app is live! ✨

## Step 3: Use the App

1. Click the **Settings icon** (⚙️) in top right
2. Paste your **Groq API Key**
3. Paste your **X Bearer Token**
4. Click **"Save Keys"**
5. Click the big green button: **"Fetch 10 Latest Naija Trends & Generate Bangers"**
6. Wait ~30 seconds for tweets to generate
7. Click **"Copy Tweet"** for any tweet you like
8. Paste on X and post! 🔥

## That's It! 🎉

You're now generating viral Naija tweets automatically.

### Pro Tips

- **Your keys stay in your browser** - they're not sent to our servers
- **Generate multiple times** - trends change, so you'll get fresh tweets
- **Customize the prompt** - edit `lib/groq.ts` to change tweet style
- **Change colors** - edit `app/globals.css` to customize the theme

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid API Key" | Double-check your keys are correct. Regenerate them if needed. |
| "No trends returned" | X API might be slow. Wait 10 seconds and try again. |
| "Rate limit exceeded" | Groq free tier has limits. Wait 5 minutes and retry. |
| Keys not saving | Make sure browser localStorage is enabled. Try a different browser. |

## Next Steps

- Read the full [README.md](./README.md) for advanced features
- Customize the tweet prompt in `lib/groq.ts`
- Deploy to Vercel for a live URL
- Share your app with other Naija Twitter enthusiasts! 🚀

---

**Questions?** Check the README for detailed docs, or try troubleshooting section above.

Oya, go generate some bangers! 🔥
