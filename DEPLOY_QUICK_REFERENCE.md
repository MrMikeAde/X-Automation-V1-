# NaijaTrendBanger - Deploy in 5 Minutes

## Fastest Way: Deploy to Vercel

### Prerequisites
- GitHub account (free)
- Groq API key (get at [console.groq.com](https://console.groq.com/keys))

### 5-Step Deployment

**Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "NaijaTrendBanger"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/naija-trend-banger.git
git push -u origin main
```

**Step 2: Go to Vercel**
- Visit [vercel.com](https://vercel.com)
- Click "Add New Project"
- Select your repo
- Click "Import"

**Step 3: Add Environment Variable**
- In Vercel dashboard, go to Settings → Environment Variables
- Add: `GROQ_API_KEY` = `gsk_your_key_here`
- Save

**Step 4: Deploy**
- Click "Deploy" button
- Wait ~3 minutes for build
- Get your live URL

**Step 5: Test**
- Open your URL
- Click Settings icon
- Paste Groq API key
- Click "Fetch 10 Latest Naija Trends"
- Done!

---

## Alternative: Docker Deploy

```bash
# Build
docker build -t naija-trend-banger .

# Run (port 3000)
docker run -p 3000:3000 \
  -e GROQ_API_KEY=gsk_your_key \
  naija-trend-banger
```

---

## Local Testing First (Recommended)

```bash
# 1. Setup
npm install

# 2. Create .env.local
echo "GROQ_API_KEY=gsk_your_key_here" > .env.local

# 3. Run
npm run dev

# 4. Test at http://localhost:3000
```

---

## Environment Variables

| Env Var | Required | Where to Add |
|---------|----------|-------------|
| GROQ_API_KEY | Yes | Vercel Settings → Environment Variables |

That's it! Only one variable needed.

---

## Deployed? Verify It Works

Test your live app:

```bash
curl -X POST https://your-vercel-url/api/bangers \
  -H "Content-Type: application/json" \
  -d '{"groqApiKey":"gsk_your_key"}'
```

Should return trends with generated tweets.

---

## If Something Breaks

**Check Function Logs** (Vercel):
1. Go to your project
2. Click "Deployments"
3. Click latest deployment
4. View "Function Logs"

**Rollback instantly:**
1. Go to "Deployments" tab
2. Click previous version
3. Click "Redeploy"

---

## Common Issues

| Error | Fix |
|-------|-----|
| "Invalid API key" | Get new key at [console.groq.com/keys](https://console.groq.com/keys) |
| "Trends page down" | Wait 1 min, try again (uses demo trends automatically) |
| "Rate limited" | Wait 60 seconds before next request |
| "App won't load" | Check browser console (F12), verify Groq key is set |

---

## Next Steps

1. ✅ Deploy to Vercel (5 mins)
2. ✅ Test live (1 min)
3. Share your URL with people
4. Monitor usage in Vercel dashboard

That's all! Your app is now live and generating viral Naija tweets.
