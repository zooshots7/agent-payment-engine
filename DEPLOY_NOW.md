# 🚀 SOL-IZER Ready to Deploy!

## ✅ What's Done

- [x] All TypeScript errors fixed
- [x] Frontend builds successfully
- [x] Backend builds successfully
- [x] All code pushed to GitHub
- [x] Deployment configs created (Dockerfile, railway.toml, vercel.json)

---

## 🎯 Next Steps - 2 Quick Commands!

### 1️⃣ Login to Vercel (Frontend)

```bash
vercel login
```

This will open a browser window. Login with GitHub.

### 2️⃣ Login to Railway (Backend)

```bash
railway login
```

This will also open a browser window. Login with GitHub.

---

## 🚀 Deploy Commands

### Deploy Frontend (Vercel)

```bash
cd agent-payment-engine/frontend
vercel --prod
```

You'll get a URL like: `https://sol-izer.vercel.app`

### Deploy Backend (Railway)

```bash
cd agent-payment-engine
railway init
railway up
```

**After deployment, Railway will give you a domain like:**
`https://sol-izer-production.up.railway.app`

---

## 🔐 Environment Variables

### For Railway (Backend):

Add these in Railway dashboard → Variables:

```env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
WALLET_PRIVATE_KEY=your_base58_private_key
OPENAI_API_KEY=sk-...
NODE_ENV=production
PORT=3000
```

### For Vercel (Frontend):

Add these in Vercel dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-railway-backend.up.railway.app
VITE_SOLANA_NETWORK=mainnet-beta
```

**Important:** After Railway deployment, copy the backend URL and update `VITE_API_URL` in Vercel, then redeploy frontend:

```bash
cd frontend
vercel --prod
```

---

## 📋 Checklist

- [ ] `vercel login` ✅
- [ ] `railway login` ✅
- [ ] Deploy frontend: `cd frontend && vercel --prod`
- [ ] Deploy backend: `railway init && railway up`
- [ ] Add env vars to Railway
- [ ] Copy Railway URL
- [ ] Add Railway URL to Vercel (`VITE_API_URL`)
- [ ] Redeploy frontend with backend URL

---

## 🎉 You're Done!

Once both are deployed:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app
- Auto-deploys on every `git push`
- Free tier covers most usage

---

**Full guide available in:** `DEPLOYMENT.md`

**Built with ✨ by aura10x**
