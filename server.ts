import express from 'express';
import cors from 'cors';
import { YieldOptimizer, Protocol } from './src/strategy/yield-optimizer';
import { RouteOptimizer } from './src/strategy/route-optimizer';
import { FraudDetector } from './src/ml/fraud-detector';
import { DynamicPricing } from './src/strategy/dynamic-pricing';
import { SwarmCoordinator } from './src/swarm/coordinator';
import { AnalyticsDashboard } from './src/analytics/dashboard';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize backend services
const mockProtocols: Protocol[] = [
  { name: 'Kamino', apy: 14.2, tvl: 450000000, risk: 'Low', weight: 1.0 },
  { name: 'Marginfi', apy: 12.8, tvl: 380000000, risk: 'Low', weight: 0.9 },
  { name: 'Drift', apy: 18.5, tvl: 220000000, risk: 'Medium', weight: 0.7 },
  { name: 'Solend', apy: 11.3, tvl: 310000000, risk: 'Low', weight: 0.85 },
  { name: 'Mango', apy: 22.1, tvl: 150000000, risk: 'High', weight: 0.5 }
];

// Initialize services with configs
const yieldOptimizer = new YieldOptimizer(mockProtocols, 'balanced', 1000000);

const routeConfig = {
  enabled: true,
  chains: ['solana', 'ethereum', 'base', 'arbitrum', 'polygon', 'optimism'] as const,
  optimizeFor: 'balance' as const,
  maxHops: 3,
  slippageTolerance: 1,
  bridges: ['wormhole', 'mayan', 'allbridge', 'stargate', 'hop'],
  gasMultiplier: 1.1
};
const routeOptimizer = new RouteOptimizer(routeConfig);

const fraudConfig = {
  velocityThreshold: 10,
  amountThreshold: 10000,
  learningMode: true,
  maxHistorySize: 1000
};
const fraudDetector = new FraudDetector(fraudConfig);

const pricingConfig = {
  enabled: true,
  basePrice: 100,
  currency: 'USD',
  adjustmentFactors: [
    { name: 'demand', type: 'demand' as const, weight: 0.3, enabled: true },
    { name: 'competitor', type: 'competitor' as const, weight: 0.25, enabled: true },
    { name: 'time', type: 'time' as const, weight: 0.2, enabled: true },
    { name: 'capacity', type: 'capacity' as const, weight: 0.25, enabled: true }
  ],
  priceFloor: 50,
  priceCeiling: 200,
  updateFrequency: '5m' as const,
  abTestingEnabled: true,
  learningRate: 0.01
};
const dynamicPricing = new DynamicPricing(pricingConfig);

const swarmConfig = {
  name: 'Payment Swarm',
  agents: [
    { role: 'validator' as const, count: 5, votingWeight: 1.0 },
    { role: 'executor' as const, count: 4, votingWeight: 1.2 },
    { role: 'optimizer' as const, count: 3, votingWeight: 1.0 },
    { role: 'risk-assessor' as const, count: 3, votingWeight: 1.5 },
    { role: 'coordinator' as const, count: 2, votingWeight: 2.0 }
  ],
  consensusThreshold: 0.66,
  timeoutSeconds: 30,
  maxRetries: 3,
  failureRecoveryEnabled: true
};
const swarmCoordinator = new SwarmCoordinator(swarmConfig);

const analytics = new AnalyticsDashboard();

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    services: {
      yieldOptimizer: 'running',
      routeOptimizer: 'running',
      fraudDetector: 'running',
      dynamicPricing: 'running',
      swarmCoordinator: 'running',
      analytics: 'running'
    },
    timestamp: new Date().toISOString()
  });
});

// Yield Optimizer
app.get('/api/yield/allocation', (req, res) => {
  const allocation = yieldOptimizer.getOptimalAllocation();
  res.json(allocation);
});

app.get('/api/yield/performance', (req, res) => {
  const performance = yieldOptimizer.getPerformance();
  res.json(performance);
});

app.get('/api/yield/protocols', (req, res) => {
  res.json(mockProtocols);
});

// Route Optimizer
app.post('/api/route/optimize', async (req, res) => {
  const { fromChain, toChain, amount, strategy = 'balanced' } = req.body;
  
  try {
    const route = await routeOptimizer.findOptimalRoute(fromChain, toChain, amount, strategy);
    res.json(route);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/route/stats', (req, res) => {
  const stats = routeOptimizer.getRoutingStats();
  res.json(stats);
});

// Fraud Detection
app.post('/api/fraud/check', (req, res) => {
  const { transaction } = req.body;
  
  const result = fraudDetector.analyzeTransaction(transaction);
  res.json(result);
});

app.get('/api/fraud/stats', (req, res) => {
  const stats = fraudDetector.getDetectionStats();
  res.json(stats);
});

app.get('/api/fraud/profile/:userId', (req, res) => {
  const profile = fraudDetector.getUserProfile(req.params.userId);
  res.json(profile || { message: 'Profile not found' });
});

// Dynamic Pricing
app.get('/api/pricing/current', (req, res) => {
  const currentPrice = dynamicPricing.getCurrentPrice();
  res.json({ price: currentPrice });
});

app.post('/api/pricing/optimize', (req, res) => {
  const { demand, competitors } = req.body;
  
  const optimizedPrice = dynamicPricing.optimizePrice(demand, competitors);
  res.json({ optimizedPrice });
});

app.get('/api/pricing/abtest', (req, res) => {
  const results = dynamicPricing.getABTestResults();
  res.json(results);
});

app.get('/api/pricing/metrics', (req, res) => {
  const metrics = dynamicPricing.getPerformanceMetrics();
  res.json(metrics);
});

// Agent Swarm
app.post('/api/swarm/task', async (req, res) => {
  const { task } = req.body;
  
  try {
    const result = await swarmCoordinator.submitTask(task);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/swarm/agents', (req, res) => {
  const agents = swarmCoordinator.getActiveAgents();
  res.json(agents);
});

app.get('/api/swarm/metrics', (req, res) => {
  const metrics = swarmCoordinator.getPerformanceMetrics();
  res.json(metrics);
});

app.post('/api/swarm/consensus', async (req, res) => {
  const { proposal } = req.body;
  
  try {
    const decision = await swarmCoordinator.requestConsensus(proposal);
    res.json(decision);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Analytics Dashboard
app.get('/api/analytics/dashboard', (req, res) => {
  const report = analytics.generateReport();
  res.json(report);
});

app.get('/api/analytics/alerts', (req, res) => {
  const alerts = analytics.getActiveAlerts();
  res.json(alerts);
});

app.post('/api/analytics/snapshot', (req, res) => {
  const { data } = req.body;
  
  analytics.recordSnapshot(data);
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Agent Payment Engine API Server running on http://localhost:${PORT}`);
  console.log(`\n📊 Available endpoints:`);
  console.log(`   GET  /api/health                    - Health check`);
  console.log(`   GET  /api/yield/*                   - Yield optimization`);
  console.log(`   POST /api/route/optimize            - Route optimization`);
  console.log(`   POST /api/fraud/check               - Fraud detection`);
  console.log(`   GET  /api/pricing/*                 - Dynamic pricing`);
  console.log(`   POST /api/swarm/task                - Agent swarm tasks`);
  console.log(`   GET  /api/analytics/dashboard       - Analytics dashboard`);
  console.log(`\n🎨 Frontend: http://localhost:5173 (run 'cd frontend && npm run dev')`);
});

export default app;
