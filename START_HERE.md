# 🔥 NaijaTrendBanger - START HERE

Welcome! You've got a complete, production-ready app that generates viral Naija tweets. Here's how to get started in **5 minutes**.

## What You Got

A single-page web app that:
1. Fetches the 10 hottest trending topics in Nigeria (real-time)
2. Uses AI (Groq) to generate authentic Naija-style viral tweets
3. Lets you copy tweets with one click and post to X

**No bots. Just fire tweets that sound like a real sharp Naija guy posting.**

---

## 📚 Documentation Files (Pick Your Path)

### **Just want to run it?** → Read `QUICKSTART.md` (5 min)
- Step-by-step for running locally
- No deep technical knowledge needed

### **Need API setup details?** → Read `API_SETUP.md` (10 min)
- How to get Groq and X API keys
- Screenshots and troubleshooting
- Security best practices

### **Want to understand the code?** → Read `PROJECT_STRUCTURE.md` (20 min)
- Complete file-by-file breakdown
- How components talk to each other
- Where to customize things

### **Ready to deploy?** → Read `DEPLOYMENT.md` (15 min)
- How to go live on Vercel (free!)
- Add custom domain
- Monitor and scale

### **Need full details?** → Read `README.md` (Complete reference)
- Everything about the project
- All features explained
- Advanced customization

---

## 🚀 Quick Start (2 Minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Run the dev server
pnpm dev

# 3. Open http://localhost:3000
# 4. Click Settings (⚙️) and add your API keys
# 5. Generate some bangers! 🔥
```

**You need 2 API keys** (get them in 2 minutes):

1. **Groq API Key**: Go to https://console.groq.com/keys → Create key
2. **X Bearer Token**: Go to https://developer.twitter.com → Get token

Full instructions in `API_SETUP.md`

---

## 📁 What's in the Project

```
├── README.md              ← Full documentation
├── QUICKSTART.md          ← 5-min quick start
├── API_SETUP.md           ← Get your API keys
├── PROJECT_STRUCTURE.md   ← Understand the code
├── DEPLOYMENT.md          ← Go live on Vercel
├── START_HERE.md          ← This file
│
├── app/
│   ├── page.tsx           ← Your app (main file)
│   ├── layout.tsx         ← Page wrapper
│   ├── globals.css        ← Styles
│   └── api/bangers/route.ts ← Backend (fetches trends + generates tweets)
│
├── components/
│   ├── TrendCard.tsx      ← Individual trend display
│   └── ui/                ← Pre-built components
│
├── lib/
│   ├── types.ts           ← TypeScript interfaces
│   ├── groq.ts            ← AI tweet generation
│   └── x-api.ts           ← Fetch trends
│
├── package.json           ← Dependencies
├── tailwind.config.ts     ← Styling config
└── tsconfig.json          ← TypeScript config
```

---

## ✅ Verification Checklist

After creating this project, make sure:

- [ ] All files are in place (check folders above)
- [ ] Run `pnpm install` successfully
- [ ] `pnpm dev` starts the server
- [ ] App opens at `http://localhost:3000`
- [ ] Settings modal opens when clicking ⚙️
- [ ] API key fields are visible and ready

---

## 🎯 Next Steps (Pick One)

### **Option 1: Run Locally First**
1. Follow `QUICKSTART.md`
2. Test everything works
3. Then read `DEPLOYMENT.md` to go live

### **Option 2: Deploy Immediately**
1. Get API keys from `API_SETUP.md`
2. Push to GitHub
3. Follow `DEPLOYMENT.md` to deploy to Vercel
4. Share your URL with the world! 🚀

### **Option 3: Customize First**
1. Read `PROJECT_STRUCTURE.md`
2. Edit colors/text in `app/page.tsx` or `app/globals.css`
3. Change the tweet prompt in `lib/groq.ts`
4. Then run or deploy

---

## 🔑 API Keys You Need

### Get Groq API Key (2 minutes)
1. Go to https://console.groq.com
2. Sign up with Google or GitHub
3. Click "API Keys"
4. Create a new key
5. Copy it (starts with `gsk_`)

### Get X Bearer Token (3 minutes)
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a project (if you don't have one)
3. Create an app within the project
4. Go to "Keys and Tokens"
5. Generate a "Bearer Token" (starts with `AAAAA...`)
6. Copy it

**Full instructions with screenshots:** `API_SETUP.md`

---

## 🚀 Three Ways to Run

### **Local Development** (You have the code locally)
```bash
pnpm install
pnpm dev
# Then go to http://localhost:3000
```

### **Vercel Deployment** (Live on the internet)
```bash
# Push to GitHub
git push origin main

# Go to https://vercel.com
# Click "New Project"
# Select your GitHub repo
# Click "Deploy"
# Done! Live URL appears immediately
```

### **Other Hosting** (AWS, Azure, Railway, etc.)
See `DEPLOYMENT.md` for instructions.

---

## 🛟 Help & Troubleshooting

### API Keys Not Working
- Double-check you copied the correct key
- Make sure Groq key starts with `gsk_`
- Make sure X token starts with `AAAAA...`
- Regenerate if not working → See `API_SETUP.md`

### App Won't Start
- Run `pnpm install` first
- Make sure Node.js 18+ is installed
- Clear node_modules: `rm -rf node_modules`, then reinstall

### Features Not Working
- Check browser console for errors (F12)
- Make sure API keys are correct
- Try refreshing the page
- See `README.md` troubleshooting section

### Need More Help
- Read the full docs (start with `README.md`)
- Check `PROJECT_STRUCTURE.md` to understand the code
- See `DEPLOYMENT.md` for deployment issues

---

## 🎨 Customization

### Change Colors
Edit `app/globals.css` - search for `#00A651` (Naija green)

### Change Tweet Style
Edit `lib/groq.ts` - modify the `systemPrompt` variable

### Add Your Logo
Put image in `public/` folder, reference in `app/page.tsx`

### Change Trends Count
Edit `lib/x-api.ts` - change `.slice(0, 10)` to `.slice(0, N)`

---

## 📊 Project Features

✅ Real-time Nigerian trends  
✅ AI-generated Naija tweets  
✅ One-click copy to clipboard  
✅ Beautiful dark mode UI  
✅ Mobile responsive  
✅ Fast API route  
✅ Type-safe TypeScript  
✅ Production-ready code  
✅ Comprehensive documentation  
✅ Easy deployment  

---

## 🎓 Learn More

### About the Tech
- **Next.js 16**: React framework (nextjs.org)
- **Groq**: Fast AI inference (groq.com)
- **X API**: Twitter data (developer.twitter.com)
- **Tailwind CSS**: Styling (tailwindcss.com)
- **shadcn/ui**: Components (ui.shadcn.com)

### Official Docs
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs
- Groq: https://console.groq.com/docs
- X API: https://developer.twitter.com/docs
- Tailwind: https://tailwindcss.com/docs

---

## 📋 Your Checklist

- [ ] Read this file (you're doing it! ✓)
- [ ] Get API keys (`API_SETUP.md`)
- [ ] Run locally or deploy (`QUICKSTART.md` or `DEPLOYMENT.md`)
- [ ] Test the app works
- [ ] Copy and post some tweets 🔥
- [ ] Share your URL or code with others
- [ ] Customize to your liking (`PROJECT_STRUCTURE.md`)

---

## 🎉 You're All Set!

You have everything you need to generate viral Naija tweets. Pick a documentation file above and jump in!

### Still Stuck?
1. Read the relevant docs first
2. Check troubleshooting sections
3. Search docs for your issue

---

**Ready to make some fire tweets?** 🔥

Start with `QUICKSTART.md` if you just want to run it.  
Start with `API_SETUP.md` if you need help getting keys.  
Start with `DEPLOYMENT.md` if you want to go live immediately.

**Oya, let's go!** 🚀
