# NaijaTrendBanger - Complete Deployment Guide

## Overview

This guide covers deploying **NaijaTrendBanger** to production. The app is fully optimized for Vercel but works on any Node.js host.

---

## Option 1: Deploy to Vercel (Recommended - Free)

### Step 1: Prepare Your Repository

```bash
# Clone your project or connect existing repo
git init
git add .
git commit -m "Initial commit: NaijaTrendBanger"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** with GitHub/GitLab/Bitbucket
3. **Click "Add New..." → "Project"**
4. **Select your repository** containing NaijaTrendBanger
5. **Click "Import"**

### Step 3: Configure Environment Variables

In the Vercel dashboard:

1. Navigate to **Settings → Environment Variables**
2. Add the following variables:

```
GROQ_API_KEY = gsk_your_groq_key_here
```

**Note:** Only `GROQ_API_KEY` is required. Trends are fetched from public sources.

3. Click **"Save"**

### Step 4: Deploy

1. **Click "Deploy"** button
2. Vercel builds and deploys automatically
3. You get a live URL like: `https://naija-trend-banger.vercel.app`

### Step 5: Test Live Deployment

```bash
curl -X POST https://your-deployment-url/api/bangers \
  -H "Content-Type: application/json" \
  -d '{"groqApiKey": "gsk_your_key"}'
```

Expected response:
```json
{
  "success": true,
  "timestamp": "2026-04-11T...",
  "trends": [
    {
      "rank": 1,
      "topic": "Naija Music Vibes",
      "tweetVolume": "Trending",
      "generatedTweet": "...",
      "characterCount": 245
    }
  ]
}
```

---

## Option 2: Deploy to Other Platforms

### Deploy to Railway

1. **Go to [railway.app](https://railway.app)**
2. **New Project → GitHub Repo → Select NaijaTrendBanger**
3. **Add Environment Variable:**
   - Key: `GROQ_API_KEY`
   - Value: `gsk_...`
4. **Deploy**

### Deploy to Netlify (with Serverless Functions)

1. **Go to [netlify.com](https://netlify.com)**
2. **New site from Git → Select repo**
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Add Environment Variables** in Site Settings
5. **Deploy**

### Deploy to Self-Hosted Server (Docker)

#### Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

#### Build & Run

```bash
# Build image
docker build -t naija-trend-banger .

# Run container
docker run \
  -p 3000:3000 \
  -e GROQ_API_KEY=gsk_your_key \
  naija-trend-banger
```

App runs on `http://localhost:3000`

---

## Local Development & Testing

### Setup Local Environment

```bash
# 1. Clone/download project
cd naija-trend-banger

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.example .env.local

# 4. Add your Groq API key
# Edit .env.local:
# GROQ_API_KEY=gsk_your_key_here
```

### Run Development Server

```bash
npm run dev
```

- Opens at `http://localhost:3000`
- Hot reload on file changes
- View logs in terminal

### Test API Endpoint

```bash
# In another terminal
curl -X POST http://localhost:3000/api/bangers \
  -H "Content-Type: application/json" \
  -d '{"groqApiKey": "gsk_your_key"}'
```

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables Reference

### Production (Deployed)

| Variable | Required | Format | Example |
|----------|----------|--------|---------|
| `GROQ_API_KEY` | Yes | String starting with `gsk_` | `gsk_XXXxxx...` |

### Development (.env.local)

```env
GROQ_API_KEY=gsk_your_api_key_here
```

### Optional Advanced Settings (Not Required)

If self-hosting, you can configure:

```env
# Node environment
NODE_ENV=production

# Port (default: 3000)
PORT=3000

# Rate limiting (requests per minute, default: 10)
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000

# Timeouts (milliseconds)
GROQ_TIMEOUT_MS=30000
SCRAPER_TIMEOUT_MS=8000
```

---

## Monitoring & Debugging

### Check Deployment Status

**Vercel:**
1. Go to your project dashboard
2. Click **"Deployments"**
3. View build logs and runtime status

**Railway/Netlify:**
- Check **Deployment logs** in dashboard
- View **Observability/Monitoring** section

### Common Errors & Solutions

#### Error: "Invalid Groq API key"
- **Cause:** Wrong or expired API key
- **Fix:** 
  1. Go to [console.groq.com/keys](https://console.groq.com/keys)
  2. Create new API key
  3. Update environment variable

#### Error: "Trends page temporarily down"
- **Cause:** Scraper sources unavailable
- **Fix:** App automatically uses demo trends. Check back in 1-2 minutes.

#### Error: "Too many requests"
- **Cause:** Rate limiting (10 req/min per IP)
- **Fix:** Wait 60 seconds before next request

#### Error: "Groq request timed out"
- **Cause:** Network issue or API overload
- **Fix:** Retry after 30 seconds

#### 502 Bad Gateway on Vercel
- **Cause:** Function timeout or out of memory
- **Fix:** Check function logs, ensure Groq API key is valid

### Enable Detailed Logging

#### For Vercel

1. **Settings → Functions → Advanced**
2. Enable **"Function Logs"**
3. View logs in **Deployments → Function Logs**

#### For Self-Hosted

```bash
# Enable debug mode
NODE_DEBUG=* npm start

# Or use pm2 with logs
pm2 start "npm start" --name naija-banger
pm2 logs naija-banger
```

---

## Performance Optimization

### Vercel Deployment Best Practices

1. **Use Vercel Analytics** (free tier)
   - Settings → Analytics → Enable
   - Monitor page speed and usage

2. **Enable Caching** (app already does this)
   - Scraper results cached per request
   - Groq timeouts prevent hanging

3. **Monitor Serverless Functions**
   - Cold start: ~1-2 seconds
   - Warm: <500ms for trend fetch
   - Tweet generation: 2-5 seconds per trend

### Expected Performance Metrics

| Operation | Time | Notes |
|-----------|------|-------|
| Fetch 10 trends | 10-15s | Scraper runs in parallel |
| Generate 1 tweet | 1-3s | Depends on Groq API load |
| Generate 10 tweets | 5-10s | Batched processing |
| User settings load | <100ms | Client-side localStorage |

---

## Security Checklist

Before deploying to production:

- [ ] **API Key Security**
  - [ ] Use environment variables (never in code)
  - [ ] Rotate key every 90 days
  - [ ] Never commit `.env` files

- [ ] **Rate Limiting**
  - [ ] Enabled by default (10 req/min per IP)
  - [ ] Monitor for abuse patterns

- [ ] **Input Validation**
  - [ ] API key format validated (gsk_*)
  - [ ] Topic length validated
  - [ ] HTML entities properly decoded

- [ ] **Error Handling**
  - [ ] No sensitive info in error messages
  - [ ] User-friendly error messages displayed
  - [ ] Backend errors logged securely

- [ ] **HTTPS**
  - [ ] All traffic encrypted (Vercel provides free SSL)
  - [ ] No unencrypted data transmission

---

## Maintenance & Updates

### Regular Tasks

**Weekly:**
- Check Vercel deployment status
- Monitor error rates in Function Logs
- Verify API key is working

**Monthly:**
- Review usage analytics
- Check for dependency updates: `npm outdated`
- Test all features manually

**Quarterly:**
- Update dependencies: `npm update`
- Rotate Groq API key
- Review rate limiting metrics

### Update Groq SDK

```bash
npm update groq-sdk

# Then test
npm run build
npm start
```

### Update Next.js

```bash
npm install next@latest

# Run build
npm run build

# Test thoroughly before deploying
npm start
```

---

## Rollback on Issues

### If Deployed Version Has Issues

**Vercel Rollback:**
1. Go to **Deployments** tab
2. Find previous working deployment
3. Click **"Redeploy"** on that version
4. Instant rollback to stable version

**Git/Source Rollback:**
```bash
# Revert last commit
git revert HEAD --no-edit
git push

# Vercel auto-redeploys from latest commit
```

---

## Scaling Considerations

### Current Limits (Vercel Free)

- **Executions:** Unlimited
- **Bandwidth:** 100GB/month
- **Concurrent functions:** 10
- **Function timeout:** 60 seconds

### When You Need to Upgrade

Upgrade to **Pro ($20/month)** if:
- >100GB/month bandwidth usage
- Need priority support
- Want custom domains without DNS

### Handling High Traffic

1. **Rate limiting** prevents abuse (10 req/min)
2. **Groq SDK** handles queueing
3. **Parallel trend generation** optimized
4. **Demo data fallback** ensures availability

---

## Support & Troubleshooting

### Quick Help

**Problem: "Groq API key not working"**
```bash
# Test API key
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer gsk_your_key"

# Should return list of available models
```

**Problem: "App won't load"**
- Check browser console (F12 → Console tab)
- Check Vercel Function Logs
- Verify API key in Settings modal

**Problem: "Trends not loading"**
- Check demo trends work (should display even if scraper fails)
- Verify Groq API key is set
- Check rate limiting (wait 60 seconds)

### Get Help

1. **Check logs:** Vercel dashboard → Deployments → Function Logs
2. **Read docs:** Review README.md and IMPLEMENTATION_GUIDE.md
3. **Debug locally:** Run `npm run dev` and test

---

## Summary

**Deployed successfully when:**
- App loads at your URL
- Settings modal opens
- Can save Groq API key
- Trends fetch and tweets generate
- Copy/Share/Refresh buttons work
- Rate limiting prevents spam

You're ready for production! Monitor regularly and handle errors gracefully.
