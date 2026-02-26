// Mock data service for realistic dashboard data

export interface Transaction {
  id: string
  timestamp: Date
  amount: number
  currency: string
  from: string
  to: string
  status: 'completed' | 'pending' | 'failed'
  chain: string
}

export interface Agent {
  id: string
  name: string
  type: string
  status: 'active' | 'idle' | 'error'
  tasksCompleted: number
  successRate: number
  avgResponseTime: number
  lastActive: Date
}

export interface MetricDataPoint {
  timestamp: string
  value: number
}

// Generate realistic time series data
function generateTimeSeriesData(hours: number = 24, baseValue: number = 1000, variance: number = 0.3): MetricDataPoint[] {
  const data: MetricDataPoint[] = []
  const now = new Date()
  
  for (let i = hours - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const randomVariance = (Math.random() - 0.5) * 2 * variance
    const value = Math.round(baseValue * (1 + randomVariance))
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(0, value)
    })
  }
  
  return data
}

// Mock transactions
export function getRecentTransactions(limit: number = 10): Transaction[] {
  const chains = ['Solana', 'Ethereum', 'Base', 'Arbitrum']
  const statuses: Array<'completed' | 'pending' | 'failed'> = ['completed', 'completed', 'completed', 'completed', 'pending', 'failed']
  
  return Array.from({ length: limit }, (_, i) => ({
    id: `tx_${Date.now()}_${i}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    amount: Math.round(Math.random() * 10000 * 100) / 100,
    currency: 'USDC',
    from: `0x${Math.random().toString(16).slice(2, 10)}...`,
    to: `0x${Math.random().toString(16).slice(2, 10)}...`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    chain: chains[Math.floor(Math.random() * chains.length)]
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Mock agents
export function getAgents(): Agent[] {
  return [
    {
      id: 'agent_001',
      name: 'Yield Optimizer',
      type: 'optimizer',
      status: 'active',
      tasksCompleted: 1247,
      successRate: 98.4,
      avgResponseTime: 12,
      lastActive: new Date(Date.now() - 2000)
    },
    {
      id: 'agent_002',
      name: 'Route Optimizer',
      type: 'optimizer',
      status: 'active',
      tasksCompleted: 892,
      successRate: 99.1,
      avgResponseTime: 18,
      lastActive: new Date(Date.now() - 5000)
    },
    {
      id: 'agent_003',
      name: 'Fraud Detector',
      type: 'security',
      status: 'active',
      tasksCompleted: 3421,
      successRate: 99.8,
      avgResponseTime: 8,
      lastActive: new Date(Date.now() - 1000)
    },
    {
      id: 'agent_004',
      name: 'Price Optimizer',
      type: 'pricing',
      status: 'active',
      tasksCompleted: 567,
      successRate: 97.2,
      avgResponseTime: 15,
      lastActive: new Date(Date.now() - 3000)
    },
    {
      id: 'agent_005',
      name: 'Risk Assessor',
      type: 'security',
      status: 'active',
      tasksCompleted: 2103,
      successRate: 98.9,
      avgResponseTime: 11,
      lastActive: new Date(Date.now() - 4000)
    }
  ]
}

// Dashboard metrics
export function getDashboardMetrics() {
  return {
    totalVolume: 2456789,
    totalTransactions: 8934,
    activeAgents: 5,
    avgResponseTime: 12.4,
    successRate: 98.7,
    hourlyRevenue: generateTimeSeriesData(24, 102000, 0.2),
    transactionVolume: generateTimeSeriesData(24, 375, 0.3),
    agentActivity: generateTimeSeriesData(24, 85, 0.15)
  }
}

// Analytics data
export function getAnalyticsData() {
  return {
    yieldPerformance: {
      currentAPY: 14.2,
      avgAPY: 12.8,
      totalEarned: 124567,
      protocols: [
        { name: 'Kamino', apy: 15.4, tvl: 125000, allocation: 35 },
        { name: 'Marginfi', apy: 14.8, tvl: 98000, allocation: 28 },
        { name: 'Drift', apy: 13.2, tvl: 87000, allocation: 25 },
        { name: 'Solend', apy: 12.1, tvl: 42000, allocation: 12 }
      ]
    },
    fraudDetection: {
      totalScanned: 8934,
      flagged: 47,
      blocked: 12,
      falsePositives: 2,
      avgRiskScore: 0.12,
      recentIncidents: generateTimeSeriesData(24, 2, 0.5)
    },
    routeOptimization: {
      totalRoutes: 892,
      avgSavings: 4.7,
      totalSaved: 4192,
      chains: [
        { name: 'Solana', usage: 45, avgCost: 0.02 },
        { name: 'Ethereum', usage: 25, avgCost: 12.45 },
        { name: 'Base', usage: 18, avgCost: 0.35 },
        { name: 'Arbitrum', usage: 12, avgCost: 0.82 }
      ]
    }
  }
}
