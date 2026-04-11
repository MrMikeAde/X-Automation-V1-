# NaijaTrendBanger - Pre-Deployment Checklist

## Before You Deploy - Verify Everything

### Code & Dependencies ✅
- [ ] Run `npm install` - all dependencies installed
- [ ] Run `npm run build` - build completes without errors
- [ ] Run `npm run dev` - app starts on localhost:3000
- [ ] No TypeScript errors: `npx tsc --noEmit`

### Local Testing ✅
- [ ] Open http://localhost:3000
- [ ] Settings icon opens modal
- [ ] Can type in Groq API key field
- [ ] "Fetch Trends" button works
- [ ] Trends appear on screen
- [ ] Copy button copies tweet to clipboard
- [ ] Refresh button generates new tweet
- [ ] Share to X button opens Twitter
- [ ] Character counter shows correct count

### Configuration ✅
- [ ] `.env.local` has `GROQ_API_KEY=gsk_...`
- [ ] `.env.example` has template
- [ ] `package.json` has all dependencies
- [ ] `tsconfig.json` is correct
- [ ] `next.config.mjs` exists

### Git ✅
- [ ] Code is committed: `git status` is clean
- [ ] Remote is set: `git remote -v` shows origin
- [ ] Ready to push: `git push origin main`

---

## Deployment Preparation

### Get API Keys ✅
- [ ] Go to [console.groq.com/keys](https://console.groq.com/keys)
- [ ] Create new API key
- [ ] Copy full key: `gsk_xxxxxxxx...`
- [ ] Keep it safe (don't commit to GitHub)

### GitHub Repository ✅
- [ ] Code pushed to GitHub
- [ ] Repository is public (or GitHub account is connected to Vercel)
- [ ] Main branch is up to date

---

## Platform-Specific Checklists

### If Deploying to Vercel ✅
- [ ] Have Vercel account (free at vercel.com)
- [ ] Connected to GitHub account
- [ ] Ready to import repository
- [ ] Have Groq API key ready
- [ ] Know what environment variable name is: `GROQ_API_KEY`

### If Deploying with Docker ✅
- [ ] Docker installed on your machine
- [ ] Dockerfile exists in project root
- [ ] Can build locally: `docker build -t naija-trend-banger .`
- [ ] Can run locally: `docker run -p 3000:3000 -e GROQ_API_KEY=... .`

### If Deploying to Railway/Netlify/etc ✅
- [ ] Account created on chosen platform
- [ ] Node.js/Next.js support confirmed
- [ ] Ready to connect GitHub repo
- [ ] Environment variable setup understood

---

## Final Verification

### Essential Files Present ✅
- [ ] `app/page.tsx` - Main page component
- [ ] `app/api/bangers/route.ts` - Main API endpoint
- [ ] `app/api/bangers/refresh/route.ts` - Refresh endpoint
- [ ] `components/TrendCard.tsx` - Trend display component
- [ ] `lib/groq.ts` - Groq integration
- [ ] `lib/scraper.ts` - Trend scraper
- [ ] `lib/validation.ts` - Input validation
- [ ] `lib/rate-limiter.ts` - Rate limiting
- [ ] `lib/types.ts` - TypeScript types
- [ ] `package.json` - Dependencies
- [ ] `.env.example` - Environment template
- [ ] `Dockerfile` - Docker configuration

### Documentation Present ✅
- [ ] `00_START_HERE_FIRST.md` - Entry point
- [ ] `DEPLOY_QUICK_REFERENCE.md` - Quick deployment
- [ ] `DEPLOYMENT_GUIDE.md` - Complete guide
- [ ] `YOU_ARE_READY.md` - Full overview
- [ ] `README.md` - Project overview
- [ ] `INDEX.md` - Master index
- [ ] Other docs exist

---

## Ready to Deploy?

### All Checks Passed? ✅
- [ ] All code checks passed
- [ ] Local testing successful
- [ ] Configuration complete
- [ ] Git repository ready
- [ ] API key obtained
- [ ] Platform chosen and ready
- [ ] Documentation reviewed

**If everything is checked, you're ready to deploy!**

---

## Deployment Steps (Quick Reference)

### Vercel Deployment
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com
# 3. Click "Add New Project"
# 4. Select your repository
# 5. Add environment variable:
#    Key: GROQ_API_KEY
#    Value: gsk_your_key_here
# 6. Click "Deploy"
# 7. Wait 2-3 minutes
# 8. Get live URL
```

### Docker Deployment
```bash
# 1. Build
docker build -t naija-trend-banger .

# 2. Run
docker run -p 3000:3000 \
  -e GROQ_API_KEY=gsk_your_key \
  naija-trend-banger

# 3. Open http://localhost:3000
```

### Local Development
```bash
npm install
echo "GROQ_API_KEY=gsk_your_key" > .env.local
npm run dev
# Open http://localhost:3000
```

---

## Post-Deployment Verification

### Test Live Deployment ✅
- [ ] App loads at live URL
- [ ] Settings icon opens
- [ ] Can paste Groq API key
- [ ] Can click "Fetch Trends"
- [ ] Trends appear after 10-15 seconds
- [ ] Tweets are generated
- [ ] Copy button works
- [ ] Share button works
- [ ] Refresh button works
- [ ] No error messages in browser console

### API Endpoint Test ✅
```bash
curl -X POST https://your-url/api/bangers \
  -H "Content-Type: application/json" \
  -d '{"groqApiKey":"gsk_your_key"}'
```
- [ ] Returns valid JSON
- [ ] Contains trends array
- [ ] Tweets are generated correctly

### Monitor Logs ✅
- [ ] Vercel: Check Function Logs for errors
- [ ] Docker: Check console output
- [ ] No error messages about API key
- [ ] No timeout messages

---

## Common Issues Before Deployment

| Issue | Check | Fix |
|-------|-------|-----|
| Build fails | `npm run build` locally | Fix TypeScript errors, re-read logs |
| Tests fail | Run tests locally | Check imports, dependencies |
| API key format wrong | Verify starts with `gsk_` | Get fresh key from console.groq.com |
| File not found | Check file exists | Verify file was created correctly |
| Import errors | Check paths are relative | Use `@/` aliases from tsconfig |

---

## You're Ready When...

✅ Local build passes without errors  
✅ `npm run dev` works perfectly  
✅ All features tested locally  
✅ Groq API key is valid (starts with `gsk_`)  
✅ GitHub repo is up to date  
✅ Deployment platform is ready  
✅ You've read the relevant documentation  

---

## Success Indicators

### Deployment Successful When:
- ✅ Live URL responds (no 502/503 errors)
- ✅ App loads in browser
- ✅ Settings modal opens
- ✅ Can save API key
- ✅ Trends fetch and display
- ✅ Tweets generate correctly
- ✅ All buttons work (copy, refresh, share)

### Performance Good When:
- ⚡ App loads: <2 seconds
- ⚡ Trends fetch: 10-15 seconds
- ⚡ No timeout errors
- ⚡ Character counter accurate

### Stability Good When:
- 🛡️ No JavaScript errors in console
- 🛡️ No API errors in logs
- 🛡️ Graceful handling of demo trends
- 🛡️ Rate limiting works

---

## After Successful Deployment

1. ✅ Test thoroughly in production
2. ✅ Monitor logs for first 24 hours
3. ✅ Share URL with people
4. ✅ Collect feedback
5. ✅ Keep monitoring
6. ✅ Plan improvements

---

## Quick Deployment Guides

- **Fastest:** [DEPLOY_QUICK_REFERENCE.md](./DEPLOY_QUICK_REFERENCE.md) (5 min)
- **Complete:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) (15 min)
- **Overview:** [YOU_ARE_READY.md](./YOU_ARE_READY.md) (5 min)

---

## Final Sanity Check

Before you deploy, answer these:

1. **Do you have a Groq API key?** (from console.groq.com/keys)
2. **Is your code pushed to GitHub?** (git push origin main)
3. **Have you run `npm run build` locally?** (no errors?)
4. **Have you tested `npm run dev`?** (everything works?)
5. **Do you have a deployment platform ready?** (Vercel/Docker/etc)
6. **Have you read DEPLOY_QUICK_REFERENCE.md?** (understand steps?)

**If you answered YES to all 6: You're ready!**

Go deploy! Good luck! 🔥
