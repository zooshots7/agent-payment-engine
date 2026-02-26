# 🚀 SOL-IZER Deployment Guide

## Quick Deploy (10 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)
- Solana wallet with private key
- OpenAI API key (for AI agents)

---

## 🎯 Architecture

```
Frontend (React + Vite) → Vercel
Backend (Node.js + Solana) → Railway
Database → (Optional) Railway Postgres
```

---

## 📦 Step 1: Push to GitHub

```bash
cd agent-payment-engine

# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Create GitHub repo and push
gh repo create sol-izer --public --source=. --remote=origin --push
# OR manually: create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/sol-izer.git
git push -u origin main
```

---

## 🌐 Step 2: Deploy Frontend (Vercel)

### Option A: CLI (fastest)

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Option B: Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo: `YOUR_USERNAME/sol-izer`
3. Set **Root Directory**: `frontend`
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**

### Environment Variables (Vercel)

Add these in Vercel dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend.railway.app
VITE_SOLANA_NETWORK=mainnet-beta
```

---

## 🚂 Step 3: Deploy Backend (Railway)

### Option A: CLI

```bash
cd agent-payment-engine  # root directory
npm install -g @railway/cli
railway login
railway init
railway up
```

### Option B: Dashboard

1. Go to [railway.app/new](https://railway.app/new)
2. Click **Deploy from GitHub repo**
3. Select your `sol-izer` repo
4. Railway auto-detects the Dockerfile ✅
5. Click **Deploy**

### Environment Variables (Railway)

Add these in Railway dashboard → Variables:

```env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
WALLET_PRIVATE_KEY=your_base58_private_key_here
OPENAI_API_KEY=sk-...
X402_FACILITATOR_URL=https://facilitator.solana.com
LOG_LEVEL=info
NODE_ENV=production
PORT=3000
```

**⚠️ IMPORTANT:** Get your Solana private key:
```bash
solana-keygen recover -o wallet.json
# Then convert to base58 for the env var
```

### Get Your Backend URL

After deployment, Railway gives you a URL like:
```
https://sol-izer-production.up.railway.app
```

Copy this URL and update your **Vercel frontend** env vars (`VITE_API_URL`).

---

## 🔄 Step 4: Update Frontend API URL

```bash
# Update frontend to point to Railway backend
cd frontend
vercel env add VITE_API_URL production
# Paste your Railway URL: https://sol-izer-production.up.railway.app

# Redeploy frontend
vercel --prod
```

---

## ✅ Step 5: Verify Deployment

### Check Backend
```bash
curl https://your-backend.railway.app/health
# Should return: {"status":"ok"}
```

### Check Frontend
Visit: `https://your-frontend.vercel.app`

---

## 🎛 Alternative Deployment Options

### Frontend Alternatives
- **Netlify**: Similar to Vercel, drag-and-drop deploy
- **Cloudflare Pages**: Fastest CDN, free SSL
- **GitHub Pages**: Static hosting (no API proxy)

### Backend Alternatives
- **Render**: Similar to Railway, better for databases
- **Fly.io**: Global edge deployment, lower latency
- **DigitalOcean App Platform**: Simple PaaS
- **AWS/GCP/Azure**: Full control, more complex

---

## 🔐 Security Checklist

- [ ] Never commit `.env` file (already in `.gitignore`)
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for your frontend domain
- [ ] Use Solana devnet for testing first
- [ ] Keep wallet hot/cold separated
- [ ] Enable Railway/Vercel 2FA
- [ ] Monitor Railway logs for suspicious activity

---

## 📊 Monitoring

### Railway Dashboard
- View logs: `railway logs`
- Monitor CPU/RAM usage
- Set up alerts for downtime

### Vercel Analytics
- Free analytics built-in
- See visitor stats and performance

---

## 🐛 Troubleshooting

### Backend won't start
```bash
railway logs  # Check for errors
# Common issues:
# - Missing env vars (WALLET_PRIVATE_KEY, OPENAI_API_KEY)
# - Invalid Solana RPC URL
# - Port conflict (Railway uses PORT env var)
```

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel env vars
- Verify CORS is enabled in backend
- Check Railway service is running

### Build failures
```bash
# Test locally first
npm run build  # backend
cd frontend && npm run build  # frontend
```

---

## 💰 Cost Estimate

**Free Tier:**
- Vercel: 100GB bandwidth/month (enough for most)
- Railway: $5 credit/month (covers small apps)

**If you exceed free tier:**
- Vercel Pro: $20/month (team features)
- Railway: Pay-as-you-go (~$10-30/month for small API)

---

## 🔄 Continuous Deployment

Both platforms auto-deploy on git push:

```bash
git add .
git commit -m "Update SOL-IZER"
git push origin main
# Vercel + Railway auto-deploy ✅
```

---

## 🎉 You're Live!

Your SOL-IZER is now:
- ✅ **Frontend**: `https://sol-izer.vercel.app`
- ✅ **Backend**: `https://sol-izer.railway.app`
- ✅ **Auto-deploying** on every git push
- ✅ **SSL enabled** by default
- ✅ **Scaling** automatically

---

## 📞 Need Help?

- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Vercel Discord: [vercel.com/discord](https://vercel.com/discord)
- Solana Discord: [solana.com/discord](https://solana.com/discord)

---

**Built with ✨ by Aviral**
