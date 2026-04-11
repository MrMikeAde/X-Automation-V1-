# API Setup Guide 🔑

Detailed instructions for setting up both API keys needed for NaijaTrendBanger.

## Table of Contents
1. [Groq API Key Setup](#groq-api-key-setup)
2. [X (Twitter) API Setup](#x-twitter-api-setup)
3. [Testing Your Keys](#testing-your-keys)
4. [Security Best Practices](#security-best-practices)

---

## Groq API Key Setup

Groq powers the fast AI model that generates your Naija tweets.

### Step-by-Step

1. **Go to Groq Console**
   - Visit: https://console.groq.com
   - Sign in with Google, GitHub, or email

2. **Create an API Key**
   - Click **"API Keys"** in the left sidebar
   - Click **"Create New API Key"**
   - Give it a name like "NaijaTrendBanger"
   - Click **"Create API Key"**

3. **Copy Your Key**
   - You'll see a key starting with `gsk_`
   - Copy it immediately (you won't see it again!)
   - Paste it somewhere safe

4. **Use in the App**
   - Open NaijaTrendBanger
   - Click Settings ⚙️
   - Paste the key in the "Groq API Key" field
   - Click "Save Keys"

### Important Notes
- ✅ Free tier: 30 requests per minute
- ✅ Works great for this app
- ⚠️ Don't share your key publicly
- ⚠️ Never commit it to GitHub

---

## X (Twitter) API Setup

The X API provides real-time trending topics for Nigeria.

### Step-by-Step

1. **Create a Twitter Developer Account** (if you don't have one)
   - Go to: https://developer.twitter.com/en/portal/dashboard
   - Click **"Sign up"**
   - Complete the verification (email, phone, etc.)

2. **Create a Project** (if you don't have one)
   - Click **"Create Project"**
   - Project name: "NaijaTrendBanger" (or any name)
   - Select "Hobby" (free tier)
   - Click **"Next"**

3. **Create an App** (within your project)
   - Enter app name: "NaijaTrendBanger"
   - You'll see an API key, API secret key, and Bearer token
   - **We need the Bearer Token** (keep the page open)

4. **Get Your Bearer Token**
   - After creating the app, go to **"API Keys and Tokens"** tab
   - You'll see:
     - API Key: `XXXXXX...`
     - API Key Secret: `XXXXXX...`
     - **Bearer Token: `AAAAA...`** ← **This is what we need!**
   - Click the key icon to reveal the full Bearer Token
   - Copy it carefully

5. **Use in the App**
   - Open NaijaTrendBanger
   - Click Settings ⚙️
   - Paste the Bearer Token in the "X Bearer Token" field
   - Click "Save Keys"

### Verifying Your Setup

Your Bearer Token should:
- ✅ Start with `AAAAA`
- ✅ Be very long (500+ characters)
- ✅ Contain only letters, numbers, and `_` or `-`
- ✅ **NOT** be the API Key (which is much shorter)

### Important Notes
- ✅ Free tier: 450 requests per 15 minutes
- ✅ More than enough for this app
- ⚠️ Don't share your Bearer Token
- ⚠️ Never commit it to GitHub

### If You Can't Find Your Bearer Token

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Click on your app name
3. Go to **"Keys and Tokens"** tab
4. Scroll down to **"Authentication Tokens and Keys"** section
5. Look for **"Bearer Token"** (not API Key!)
6. If it's not there, click **"Regenerate"** to create a new one

---

## Testing Your Keys

### Test Groq Key

Your key works if:
1. You paste it in the app Settings
2. You fetch trends
3. Tweets are generated without errors

### Test X Bearer Token

Your key works if:
1. You paste it in the app Settings
2. You fetch trends
3. Trending topics appear (not an error)

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Groq Error: Invalid API Key` | Wrong Groq key | Generate a new one at https://console.groq.com/keys |
| `X API Error: 401 Unauthorized` | Wrong Bearer Token | Generate a new one in your Twitter app settings |
| `X API Error: 403 Forbidden` | Token permissions | Make sure your app has "Read" permissions enabled |
| `No trends data returned` | Temporary X API issue | Try again in 30 seconds |

---

## Security Best Practices

### ✅ DO:
- Keep keys in browser localStorage only (app doesn't send to servers)
- Regenerate keys if you accidentally share them
- Use different keys for different environments (dev, prod)
- Clear keys from the app when sharing your device

### ❌ DON'T:
- Share keys in emails, Slack, or GitHub
- Commit `.env` or `keys.txt` to Git
- Display keys in screenshots
- Use the same key across multiple devices

### Environment Variables (For Deployment)

If deploying to Vercel and want server-side defaults:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add:
   - Name: `X_BEARER_TOKEN`, Value: `your_token_here`
   - Name: `GROQ_API_KEY`, Value: `your_key_here`
4. Save and redeploy

Users can still override these via the app Settings modal.

---

## Troubleshooting

### Keys Keep Getting Cleared

**Problem:** Your API keys keep disappearing from the Settings

**Solutions:**
1. Make sure browser localStorage is enabled
2. Check if you're in a private/incognito window (clears when you close)
3. Try a different browser
4. Clear browser cache and try again

### "Rate Limit Exceeded" Error

**Problem:** Getting rate limit errors when generating tweets

**Solutions:**
- Groq free tier: 30 requests/minute (wait 60 seconds)
- X API: 450 requests/15 minutes (should be fine)
- Try again in a few minutes
- Consider upgrading to paid tier if generating many tweets daily

### "Invalid Bearer Token" After Regenerating

**Problem:** You regenerated the token but the app still shows an error

**Solutions:**
1. Clear the old token from Settings → Clear button
2. Copy the new Bearer Token again (avoid extra spaces)
3. Paste it in the Settings field
4. Click "Save Keys"
5. Try fetching trends again

### Keys Work Locally But Not on Vercel

**Problem:** App works when running locally but fails on Vercel

**Solutions:**
1. Verify you added env vars to Vercel project settings
2. Make sure you redeployed after adding env vars
3. Check that env var names match exactly (case-sensitive)
4. Users can always paste keys via the Settings modal instead

---

## Support

### Groq Support
- Docs: https://console.groq.com/docs
- Community: https://discord.gg/groq

### X API Support
- Docs: https://developer.twitter.com/en/docs/twitter-api
- Support: https://twittercommunity.com/

### This Project
- README: See `README.md`
- Quick Start: See `QUICKSTART.md`

---

**You're all set!** Your API keys are ready to go. Start generating viral Naija tweets! 🔥
