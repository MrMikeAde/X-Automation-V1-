# Deployment Guide 🚀

How to deploy NaijaTrendBanger to production.

## Quick Deploy to Vercel (Recommended)

Vercel is the official Next.js deployment platform. It's **free, fast, and automatic**.

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: NaijaTrendBanger"

# Connect to GitHub (create repo first at github.com)
git remote add origin https://github.com/YOUR_USERNAME/naijatrend-banger.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"New Project"**
3. Select your **GitHub repository**
4. Vercel auto-detects it's a Next.js project
5. Click **"Deploy"**
6. Your app is live! 🎉

### Step 3: Add Environment Variables (Optional)

If you want to set default API keys for all users:

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add:
   - Name: `X_BEARER_TOKEN`, Value: `your_token`
   - Name: `GROQ_API_KEY`, Value: `your_key`
4. Click **Redeploy** to apply changes

**Note:** Users can still provide their own keys via the Settings modal, which will override these defaults.

### That's It!

Your app is now live at `https://your-project.vercel.app`

---

## Alternative Deployment Options

### Deploy to Netlify

1. Push to GitHub (see above)
2. Go to https://netlify.com
3. Click **"Connect Git Repository"**
4. Select your repo
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables (if using defaults)
7. Click **"Deploy"**

### Deploy to AWS, Azure, DigitalOcean, etc.

Next.js works on any Node.js hosting. Generally:

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Start: `npm start`
4. Set environment variables in your hosting provider
5. Point your domain to the deployed app

---

## Custom Domain

### Using Vercel

1. In Vercel dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `naijatrend.com`)
4. Follow DNS setup instructions
5. Wait 24-48 hours for propagation

### Using Other Providers

1. Point your domain's DNS to Vercel's nameservers, or
2. Add a CNAME record pointing to your Vercel deployment

---

## Environment Variables

### Never Commit Secrets

❌ BAD:
```
X_BEARER_TOKEN=AAAAA_xxx  # Don't do this!
GROQ_API_KEY=gsk_xxx       # Don't do this!
```

✅ GOOD:
```
# .env.example (commit this)
X_BEARER_TOKEN=your_token_here
GROQ_API_KEY=your_key_here

# .env.local (don't commit this)
X_BEARER_TOKEN=AAAAA_xxx
GROQ_API_KEY=gsk_xxx
```

### In Vercel

1. Project Settings → Environment Variables
2. Add for production:
   - `X_BEARER_TOKEN`: Your real token
   - `GROQ_API_KEY`: Your real key
3. Add for preview (optional):
   - Same as above for testing
4. Redeploy

---

## Monitoring & Debugging

### View Logs on Vercel

1. Dashboard → Your Project
2. Click **"Deployments"**
3. Click the latest deployment
4. Click **"View Logs"**
5. See build and runtime output

### Check API Usage

- **Groq:** Visit https://console.groq.com (check usage stats)
- **X API:** Visit https://developer.twitter.com (check rate limits)

### Enable Analytics

In your Vercel project settings:
1. Click **Analytics** (or Web Analytics)
2. Enable to track user traffic
3. View metrics, page views, performance

---

## Performance Optimization

### Already Optimized

- ✅ Next.js 16 with Turbopack (super fast builds)
- ✅ Server-side API route (fast)
- ✅ Client-side state management (responsive UI)
- ✅ Minimal dependencies (small bundle size)
- ✅ CSS-in-JS via Tailwind (optimized)
- ✅ Image optimization (if you add images)

### Additional Tweaks

1. **Enable ISR (Incremental Static Regeneration)**
   - Cache API responses for faster repeat requests
   - Edit `/app/api/bangers/route.ts` to add caching headers

2. **Add Caching Headers**
   ```typescript
   response.headers.set('Cache-Control', 'public, max-age=300');  // 5 minutes
   ```

3. **Monitor Core Web Vitals**
   - Use Vercel Analytics to track performance
   - Optimize if LCP > 2.5s, FID > 100ms, CLS > 0.1

---

## Scaling

### When You Need More Traffic

The app scales automatically on Vercel:
- **Free tier:** Scales to millions of requests/month
- **Pro tier:** For enterprise scale and custom domains
- **Enterprise:** For dedicated support

### Optimize for Scale

1. **Rate Limiting**
   - Add rate limiting to `/api/bangers` endpoint
   - Prevent abuse of free tier APIs

2. **Caching**
   - Cache X API trends response (don't refetch every request)
   - Cache Groq responses if same trend is requested twice

3. **Database**
   - Store generated tweets to avoid re-generating
   - Track user preferences, favorites, etc.

---

## Security Checklist

- [ ] API keys are environment variables (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] No sensitive data in frontend code
- [ ] Input validation on API routes
- [ ] Rate limiting configured
- [ ] CORS headers set properly (if needed)
- [ ] No console logs with sensitive data

---

## Troubleshooting Deployment

| Issue | Cause | Solution |
|-------|-------|----------|
| Build fails | Missing environment variables | Add env vars to Vercel project settings |
| 500 errors on API | Missing API keys | Set `X_BEARER_TOKEN` and `GROQ_API_KEY` |
| Styles broken | Tailwind CSS not building | Rebuild project on Vercel |
| API calls fail | CORS issue | This app doesn't have CORS issues (proxy works) |
| Keys not working | Wrong token format | Verify tokens start with `AAAAA` and `gsk_` |

---

## CI/CD Pipeline

### Automatic Deployments with Vercel

Every push to `main` branch automatically:
1. Builds the project
2. Runs tests (if configured)
3. Deploys to preview URL
4. Runs in production if no errors

### Add GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## Rollback & Recovery

### If Something Goes Wrong

1. **On Vercel Dashboard**
   - Go to **Deployments**
   - Find the previous working version
   - Click **"Promote to Production"**
   - Instant rollback! ✨

2. **On GitHub**
   ```bash
   git revert <commit-hash>
   git push origin main
   # Vercel auto-redeploys
   ```

---

## Post-Deployment

### Tell the World! 🚀

1. Tweet about your app (using your app, of course!)
2. Share on LinkedIn, Reddit, dev communities
3. Submit to Product Hunt
4. Add to Awesome lists on GitHub

### Gather Feedback

1. Add analytics (Vercel Web Analytics)
2. Set up feedback form (Typeform, Google Forms)
3. Monitor error logs
4. Track user behavior

### Iterate

1. Fix bugs found by users
2. Add requested features
3. Optimize based on usage patterns
4. Keep dependencies updated

---

## Maintenance

### Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update major versions (careful!)
npm install next@latest
```

### Monitor API Health

- **Groq:** Check https://status.groq.com
- **X API:** Check https://api.x.com/status
- **Vercel:** Check https://www.vercelstatus.com

### Renew API Keys

- Generate new X Bearer Tokens monthly
- Generate new Groq keys if exposed
- Update in Vercel environment variables
- Notify users if they provide their own keys

---

## Support & Help

### Common Questions

**Q: How much does Vercel cost?**
A: Free tier handles millions of requests. No card required!

**Q: Can I use a custom domain?**
A: Yes! Add it in Vercel settings (costs $12/year for domain elsewhere).

**Q: How do I add a database?**
A: Vercel integrates with Postgres, MySQL, MongoDB. See Vercel Integrations.

**Q: Can I make it private (login required)?**
A: Yes! Add authentication with NextAuth.js or Supabase Auth.

### Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Groq Docs:** https://console.groq.com/docs
- **X API Docs:** https://developer.twitter.com/en/docs/twitter-api

---

## Final Checklist

Before announcing your deployment:

- [ ] App works on desktop and mobile
- [ ] All features tested
- [ ] API keys configured correctly
- [ ] Error messages are user-friendly
- [ ] Loading states visible
- [ ] Copy-to-clipboard works
- [ ] Settings modal opens/closes
- [ ] No console errors
- [ ] Performance is good (< 3s load)
- [ ] Responsive design works
- [ ] Domain configured (if custom)
- [ ] Analytics enabled
- [ ] README is clear
- [ ] API docs documented

---

**You're done!** Your app is live and ready for users. 🎉

Share it everywhere and watch the tweets roll in! 🔥
