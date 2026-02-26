# 🚀 Quick Start Guide - Agent Payment Engine

## Start the Full Stack in 30 Seconds

### Option 1: Full Stack (Recommended)

```bash
# Start both backend API and frontend together
npm run fullstack
```

This will launch:
- **Backend API**: http://localhost:3001
- **Frontend Dashboard**: http://localhost:5173

### Option 2: Separate Servers

**Terminal 1 - Backend API:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

## First Time Setup

If this is your first time:

```bash
# 1. Install root dependencies
npm install

# 2. Install frontend dependencies
cd frontend
npm install
cd ..

# 3. Start full stack
npm run fullstack
```

## What You'll See

### Backend API (http://localhost:3001)
```
🚀 Agent Payment Engine API Server running on http://localhost:3001

📊 Available endpoints:
   GET  /api/health                    - Health check
   GET  /api/yield/*                   - Yield optimization
   POST /api/route/optimize            - Route optimization
   POST /api/fraud/check               - Fraud detection
   GET  /api/pricing/*                 - Dynamic pricing
   POST /api/swarm/task                - Agent swarm tasks
   GET  /api/analytics/dashboard       - Analytics dashboard

🎨 Frontend: http://localhost:5173 (run 'cd frontend && npm run dev')
```

### Frontend Dashboard (http://localhost:5173)

Open your browser to see:
- ✨ Real-time system health indicators
- 📊 Interactive charts and visualizations
- 🤖 Agent swarm network monitor
- 💰 Live transaction feed
- 🛡️ Fraud detection alerts
- ⚡ Route optimization analytics
- 📈 Dynamic pricing dashboard

## Test the API

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Get Yield Allocation
```bash
curl http://localhost:3001/api/yield/allocation
```

### Optimize Route
```bash
curl -X POST http://localhost:3001/api/route/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "fromChain": "Ethereum",
    "toChain": "Solana",
    "amount": 5000,
    "strategy": "balanced"
  }'
```

### Check for Fraud
```bash
curl -X POST http://localhost:3001/api/fraud/check \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": {
      "userId": "user123",
      "amount": 10000,
      "fromAddress": "0x123...",
      "toAddress": "0x456...",
      "chain": "Ethereum",
      "timestamp": 1640000000000
    }
  }'
```

## Troubleshooting

### Port Already in Use

**Backend (3001):**
```bash
# Kill existing process
lsof -ti:3001 | xargs kill -9
```

**Frontend (5173):**
```bash
# Kill existing process
lsof -ti:5173 | xargs kill -9
```

### Dependencies Not Installed

```bash
# Root project
npm install

# Frontend
cd frontend && npm install
```

### TypeScript Errors

```bash
# Check types
npm run typecheck

# Build
npm run build
```

## Development Mode

The servers run in **watch mode** - they'll automatically restart when you make changes!

- **Backend**: Edit files in `src/`, `server.ts`
- **Frontend**: Edit files in `frontend/src/`

## Production Build

```bash
# Build backend
npm run build

# Build frontend
cd frontend && npm run build

# Start production server
npm start
```

## Next Steps

1. **Explore the Dashboard**: Navigate through all 7 tabs
2. **Check Live Data**: Watch real-time updates happen
3. **Test API Endpoints**: Use curl or Postman
4. **Read the Docs**: Check `FRONTEND_README.md` for details
5. **Customize**: Modify colors, charts, and layouts

## Need Help?

- Check `FRONTEND_README.md` for detailed docs
- See `README.md` for backend documentation
- All backend features are fully integrated!

---

**Built with ✨ by aura10x - The most epic frontend for the most epic backend!**
