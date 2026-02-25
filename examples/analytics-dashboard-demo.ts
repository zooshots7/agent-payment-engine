/**
 * Analytics Dashboard Demo
 * 
 * Demonstrates the analytics and monitoring capabilities:
 * - Real-time metric tracking
 * - Alert system
 * - Performance monitoring
 * - Report generation
 */

import {
  AnalyticsDashboard,
  DashboardSnapshot,
  SystemHealthMetrics,
  TransactionMetrics,
  AgentPerformanceMetrics,
  YieldMetrics,
  FraudMetrics,
  RouteMetrics,
  PricingMetrics
} from '../src/analytics/dashboard';

/**
 * Helper to create realistic mock data
 */
function createRealisticSnapshot(baseTime: number, index: number): DashboardSnapshot {
  const timestamp = new Date(baseTime + index * 5 * 60 * 1000); // 5 minute intervals

  // Simulate realistic variations
  const hourOfDay = timestamp.getHours();
  const isPeakHours = hourOfDay >= 9 && hourOfDay <= 17;
  const peakMultiplier = isPeakHours ? 1.5 : 0.7;

  const baseTransactions = 100;
  const transactions = Math.floor(baseTransactions * peakMultiplier + Math.random() * 20);
  const successRate = 0.95 + Math.random() * 0.04; // 95-99%
  const successful = Math.floor(transactions * successRate);
  const failed = transactions - successful;

  const totalTxSoFar = baseTransactions * index + transactions;
  const totalSuccessfulSoFar = Math.floor(totalTxSoFar * successRate);

  const systemHealth: SystemHealthMetrics = {
    uptime: index * 5 * 60 * 1000,
    totalTransactions: totalTxSoFar,
    successfulTransactions: totalSuccessfulSoFar,
    failedTransactions: totalTxSoFar - totalSuccessfulSoFar,
    averageResponseTime: 120 + Math.random() * 80, // 120-200ms
    activeAgents: 8,
    totalAgents: 10,
    errorRate: (totalTxSoFar - totalSuccessfulSoFar) / totalTxSoFar,
    timestamp
  };

  const transactionMetrics: TransactionMetrics = {
    totalVolume: totalTxSoFar * 1000 + Math.random() * 100000,
    averageTransactionSize: 800 + Math.random() * 400, // $800-1200
    largestTransaction: 25000 + Math.random() * 25000,
    transactionsPerHour: Math.floor(transactions * 12), // Extrapolate to hourly
    transactionsByChain: {
      solana: Math.floor(transactions * 0.6),
      ethereum: Math.floor(transactions * 0.25),
      base: Math.floor(transactions * 0.10),
      arbitrum: Math.floor(transactions * 0.05)
    },
    transactionsByStatus: {
      pending: Math.floor(Math.random() * 10),
      completed: successful,
      failed: failed,
      cancelled: Math.floor(Math.random() * 3)
    }
  };

  const agents: AgentPerformanceMetrics[] = [
    {
      agentId: 'validator-1',
      role: 'validator',
      tasksCompleted: Math.floor(index * 15 + Math.random() * 10),
      averageTaskTime: 100 + Math.random() * 50,
      successRate: 0.96 + Math.random() * 0.03,
      lastActive: timestamp,
      failureCount: Math.floor(index * 0.5),
      utilizationRate: 0.70 + Math.random() * 0.2
    },
    {
      agentId: 'validator-2',
      role: 'validator',
      tasksCompleted: Math.floor(index * 14 + Math.random() * 10),
      averageTaskTime: 110 + Math.random() * 50,
      successRate: 0.95 + Math.random() * 0.03,
      lastActive: timestamp,
      failureCount: Math.floor(index * 0.6),
      utilizationRate: 0.65 + Math.random() * 0.2
    },
    {
      agentId: 'executor-1',
      role: 'executor',
      tasksCompleted: Math.floor(index * 12 + Math.random() * 8),
      averageTaskTime: 180 + Math.random() * 60,
      successRate: 0.94 + Math.random() * 0.04,
      lastActive: timestamp,
      failureCount: Math.floor(index * 0.7),
      utilizationRate: 0.75 + Math.random() * 0.15
    },
    {
      agentId: 'optimizer-1',
      role: 'optimizer',
      tasksCompleted: Math.floor(index * 8 + Math.random() * 5),
      averageTaskTime: 200 + Math.random() * 80,
      successRate: 0.97 + Math.random() * 0.02,
      lastActive: timestamp,
      failureCount: Math.floor(index * 0.3),
      utilizationRate: 0.60 + Math.random() * 0.25
    },
    {
      agentId: 'risk-assessor-1',
      role: 'risk-assessor',
      tasksCompleted: Math.floor(index * 18 + Math.random() * 12),
      averageTaskTime: 90 + Math.random() * 40,
      successRate: 0.98 + Math.random() * 0.01,
      lastActive: timestamp,
      failureCount: Math.floor(index * 0.4),
      utilizationRate: 0.80 + Math.random() * 0.15
    }
  ];

  const yieldMetrics: YieldMetrics = {
    totalValueLocked: 5000000 + Math.random() * 500000 + index * 10000,
    currentAPY: 12.0 + Math.sin(index * 0.1) * 2 + Math.random() * 0.5,
    protocolDistribution: {
      kamino: 2500000 + Math.random() * 200000,
      marginfi: 1500000 + Math.random() * 150000,
      drift: 1000000 + Math.random() * 100000
    },
    rebalanceCount: Math.floor(index / 12), // Every hour
    profitGenerated: index * 150 + Math.random() * 50,
    lastRebalance: new Date(baseTime + Math.floor(index / 12) * 60 * 60 * 1000),
    performanceVsBaseline: 5.0 + Math.sin(index * 0.2) * 3
  };

  const fraudMetrics: FraudMetrics = {
    totalChecked: totalTxSoFar,
    flaggedCount: Math.floor(totalTxSoFar * 0.015) + Math.floor(Math.random() * 3),
    blockedCount: Math.floor(totalTxSoFar * 0.008),
    falsePositiveRate: 0.01 + Math.random() * 0.02,
    fraudPrevented: Math.floor(totalTxSoFar * 0.008 * 15000), // Avg $15k per fraud
    topRiskFactors: [
      { factor: 'velocity', count: Math.floor(index * 0.6) },
      { factor: 'amount', count: Math.floor(index * 0.4) },
      { factor: 'pattern', count: Math.floor(index * 0.3) }
    ],
    detectionAccuracy: 0.91 + Math.random() * 0.05
  };

  const routeMetrics: RouteMetrics = {
    totalRoutesCalculated: Math.floor(transactions * 0.8),
    averageHops: 2.1 + Math.random() * 0.5,
    costSavings: Math.floor(transactions * 45 + Math.random() * 100),
    averageExecutionTime: 1400 + Math.random() * 300,
    bridgeUsage: {
      wormhole: Math.floor(transactions * 0.35),
      mayan: Math.floor(transactions * 0.25),
      allbridge: Math.floor(transactions * 0.15),
      stargate: Math.floor(transactions * 0.05)
    },
    chainUsage: {
      solana: Math.floor(transactions * 0.5),
      ethereum: Math.floor(transactions * 0.25),
      base: Math.floor(transactions * 0.15),
      arbitrum: Math.floor(transactions * 0.10)
    }
  };

  const pricingMetrics: PricingMetrics = {
    averagePrice: 10.0 + Math.sin(index * 0.15) * 1.5 + Math.random() * 0.5,
    priceVolatility: 1.0 + Math.random() * 0.5,
    conversionRate: 0.60 + Math.random() * 0.1,
    revenueGenerated: totalTxSoFar * 10 + Math.random() * 5000,
    abTestsRunning: 3,
    winningVariants: [
      { variant: 'price-+10%', improvement: 5.2 },
      { variant: 'bundle-discount', improvement: 8.1 }
    ]
  };

  return {
    timestamp,
    systemHealth,
    transactions: transactionMetrics,
    agents,
    yield: yieldMetrics,
    fraud: fraudMetrics,
    routing: routeMetrics,
    pricing: pricingMetrics
  };
}

/**
 * Scenario 1: Real-time Monitoring
 * Simulate 24 hours of operations
 */
async function scenarioRealtimeMonitoring() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 1: Real-time Monitoring (24 Hour Simulation)');
  console.log('═'.repeat(80) + '\n');

  const dashboard = new AnalyticsDashboard();
  const baseTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

  console.log('📊 Simulating 24 hours of payment operations...\n');

  // Generate snapshots every 5 minutes (288 snapshots)
  const snapshotCount = 288;

  for (let i = 0; i < snapshotCount; i++) {
    const snapshot = createRealisticSnapshot(baseTime, i);
    dashboard.recordSnapshot(snapshot);

    // Show progress every 6 hours
    if ((i + 1) % 72 === 0) {
      const hours = ((i + 1) / 12).toFixed(0);
      console.log(`  ✓ ${hours} hours simulated`);
    }
  }

  console.log('\n✅ Simulation complete!\n');

  // Show current stats
  const health = dashboard.getSystemHealth();
  const txMetrics = dashboard.getTransactionMetrics();
  const stats = dashboard.getAggregateStats(24);

  console.log('📈 Current System Status:\n');
  console.log(`  Uptime: ${(health!.uptime / 1000 / 60 / 60).toFixed(1)} hours`);
  console.log(`  Total Transactions: ${stats.totalTransactions.toLocaleString()}`);
  console.log(`  Success Rate: ${(stats.averageSuccessRate * 100).toFixed(2)}%`);
  console.log(`  Total Volume: $${stats.totalVolume.toLocaleString()}`);
  console.log(`  Avg Response Time: ${health!.averageResponseTime.toFixed(0)}ms`);
  console.log(`  Active Agents: ${health!.activeAgents}/${health!.totalAgents}`);

  console.log('\n💰 Revenue & Savings:\n');
  console.log(`  Fraud Prevented: $${stats.totalFraudPrevented.toLocaleString()}`);
  console.log(`  Route Cost Savings: $${stats.totalCostSavings.toLocaleString()}`);

  console.log('\n🔝 Top Performing Agents:\n');
  const topAgents = dashboard.getTopPerformingAgents(3);
  topAgents.forEach((agent, index) => {
    console.log(`  ${index + 1}. ${agent.agentId} (${agent.role})`);
    console.log(`     Success Rate: ${(agent.successRate * 100).toFixed(2)}%`);
    console.log(`     Tasks: ${agent.tasksCompleted}`);
  });

  console.log('\n');
}

/**
 * Scenario 2: Alert System
 * Trigger and handle alerts
 */
async function scenarioAlertSystem() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 2: Alert System');
  console.log('═'.repeat(80) + '\n');

  const dashboard = new AnalyticsDashboard();
  const baseTime = Date.now();

  console.log('🚨 Monitoring for critical conditions...\n');

  // Normal operation
  console.log('Phase 1: Normal Operation');
  for (let i = 0; i < 5; i++) {
    const snapshot = createRealisticSnapshot(baseTime, i);
    dashboard.recordSnapshot(snapshot);
  }
  console.log(`  Active Alerts: ${dashboard.getActiveAlerts().length}\n`);

  // Trigger high error rate alert
  console.log('Phase 2: High Error Rate Detected');
  const errorSnapshot = createRealisticSnapshot(baseTime, 10);
  errorSnapshot.systemHealth.errorRate = 0.08; // 8% - above 5% threshold
  dashboard.recordSnapshot(errorSnapshot);
  console.log(`  Active Alerts: ${dashboard.getActiveAlerts().length}\n`);

  // Trigger slow response time
  console.log('Phase 3: Slow Response Time Detected');
  const slowSnapshot = createRealisticSnapshot(baseTime, 11);
  slowSnapshot.systemHealth.averageResponseTime = 6000; // 6s - above 5s threshold
  dashboard.recordSnapshot(slowSnapshot);
  console.log(`  Active Alerts: ${dashboard.getActiveAlerts().length}\n`);

  // Trigger fraud spike
  console.log('Phase 4: Fraud Spike Detected');
  const fraudSnapshot = createRealisticSnapshot(baseTime, 12);
  fraudSnapshot.fraud.flaggedCount = 15; // Above 10 threshold
  dashboard.recordSnapshot(fraudSnapshot);
  console.log(`  Active Alerts: ${dashboard.getActiveAlerts().length}\n`);

  // Show all alerts
  console.log('📋 Alert Summary:\n');
  const alerts = dashboard.getActiveAlerts();
  alerts.forEach((alert, index) => {
    console.log(`  ${index + 1}. [${alert.severity.toUpperCase()}] ${alert.message}`);
    console.log(`     Triggered at: ${alert.timestamp.toLocaleTimeString()}`);
  });

  // Acknowledge alerts
  console.log('\n✓ Acknowledging alerts...');
  alerts.forEach(alert => {
    dashboard.acknowledgeAlert(alert.id);
  });

  console.log(`  Active Alerts After Acknowledgment: ${dashboard.getActiveAlerts().length}\n`);
}

/**
 * Scenario 3: Performance Analytics
 * Analyze yield and routing performance
 */
async function scenarioPerformanceAnalytics() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 3: Performance Analytics');
  console.log('═'.repeat(80) + '\n');

  const dashboard = new AnalyticsDashboard();
  const baseTime = Date.now() - 12 * 60 * 60 * 1000; // 12 hours ago

  console.log('📈 Collecting 12 hours of performance data...\n');

  // Generate 12 hours of data (every 5 minutes = 144 snapshots)
  for (let i = 0; i < 144; i++) {
    const snapshot = createRealisticSnapshot(baseTime, i);
    dashboard.recordSnapshot(snapshot);
  }

  // Yield Performance
  console.log('💎 Yield Optimization Performance:\n');
  const yieldHistory = dashboard.getYieldPerformanceHistory(12);
  
  const avgAPY = yieldHistory.reduce((sum, h) => sum + h.apy, 0) / yieldHistory.length;
  const avgTVL = yieldHistory.reduce((sum, h) => sum + h.tvl, 0) / yieldHistory.length;
  const maxAPY = Math.max(...yieldHistory.map(h => h.apy));
  const minAPY = Math.min(...yieldHistory.map(h => h.apy));

  console.log(`  Average APY: ${avgAPY.toFixed(2)}%`);
  console.log(`  APY Range: ${minAPY.toFixed(2)}% - ${maxAPY.toFixed(2)}%`);
  console.log(`  Average TVL: $${avgTVL.toLocaleString()}`);
  console.log(`  Data Points: ${yieldHistory.length}`);

  // Routing Efficiency
  console.log('\n🌐 Route Optimization Efficiency:\n');
  const routingHistory = dashboard.getRoutingEfficiency(12);
  
  const avgHops = routingHistory.reduce((sum, h) => sum + h.avgHops, 0) / routingHistory.length;
  const totalSavings = routingHistory.reduce((sum, h) => sum + h.costSavings, 0);

  console.log(`  Average Hops: ${avgHops.toFixed(2)}`);
  console.log(`  Total Cost Savings: $${totalSavings.toLocaleString()}`);
  console.log(`  Savings per Route: $${(totalSavings / routingHistory.length).toFixed(2)}`);

  // Fraud Detection
  console.log('\n🛡️  Fraud Detection Effectiveness:\n');
  const fraudStats = dashboard.getFraudStats();
  
  console.log(`  Detection Accuracy: ${(fraudStats!.detectionAccuracy * 100).toFixed(2)}%`);
  console.log(`  False Positive Rate: ${(fraudStats!.falsePositiveRate * 100).toFixed(2)}%`);
  console.log(`  Fraud Prevented: $${fraudStats!.fraudPrevented.toLocaleString()}`);
  console.log(`  Block Rate: ${((fraudStats!.blockedCount / fraudStats!.totalChecked) * 100).toFixed(2)}%`);

  console.log('\n');
}

/**
 * Scenario 4: Full Dashboard Report
 * Generate comprehensive report
 */
async function scenarioFullReport() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 4: Full Dashboard Report');
  console.log('═'.repeat(80) + '\n');

  const dashboard = new AnalyticsDashboard();
  const baseTime = Date.now() - 24 * 60 * 60 * 1000;

  console.log('📊 Generating 24-hour operational report...\n');

  // Generate 24 hours of data
  for (let i = 0; i < 288; i++) {
    const snapshot = createRealisticSnapshot(baseTime, i);
    dashboard.recordSnapshot(snapshot);

    // Trigger some alerts for the report
    if (i === 100) {
      snapshot.systemHealth.errorRate = 0.07;
      dashboard.recordSnapshot(snapshot);
    }
  }

  // Generate and display report
  const report = dashboard.generateReport();
  console.log(report);
  console.log('\n');
}

/**
 * Scenario 5: Custom Alert Rules
 * Create and test custom monitoring
 */
async function scenarioCustomAlerts() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 5: Custom Alert Rules');
  console.log('═'.repeat(80) + '\n');

  const dashboard = new AnalyticsDashboard();
  const baseTime = Date.now();

  console.log('⚙️  Setting up custom alert rules...\n');

  // Add custom rules
  const rule1 = dashboard.addAlertRule({
    name: 'Very High Transaction Volume',
    metric: 'transactions.totalVolume',
    condition: 'above',
    threshold: 1000000, // $1M
    enabled: true,
    severity: 'medium'
  });

  const rule2 = dashboard.addAlertRule({
    name: 'Low Yield Performance',
    metric: 'yield.performanceVsBaseline',
    condition: 'below',
    threshold: 0, // Below baseline
    enabled: true,
    severity: 'high'
  });

  const rule3 = dashboard.addAlertRule({
    name: 'High Agent Utilization',
    metric: 'systemHealth.activeAgents',
    condition: 'above',
    threshold: 9,
    enabled: true,
    severity: 'low'
  });

  console.log(`  ✓ Created rule: ${rule1}`);
  console.log(`  ✓ Created rule: ${rule2}`);
  console.log(`  ✓ Created rule: ${rule3}\n`);

  console.log('🔍 Testing custom rules...\n');

  // Test rule 1 - high volume
  console.log('Test 1: High Transaction Volume');
  const snapshot1 = createRealisticSnapshot(baseTime, 50);
  snapshot1.transactions.totalVolume = 1500000; // $1.5M - triggers alert
  dashboard.recordSnapshot(snapshot1);
  console.log(`  Alerts triggered: ${dashboard.getActiveAlerts().length}\n`);

  // Test rule 2 - low yield
  console.log('Test 2: Low Yield Performance');
  const snapshot2 = createRealisticSnapshot(baseTime, 51);
  snapshot2.yield.performanceVsBaseline = -5.0; // -5% below baseline
  dashboard.recordSnapshot(snapshot2);
  console.log(`  Alerts triggered: ${dashboard.getActiveAlerts().length}\n`);

  // Show triggered alerts
  console.log('📋 Triggered Custom Alerts:\n');
  const alerts = dashboard.getActiveAlerts();
  alerts.forEach((alert, index) => {
    console.log(`  ${index + 1}. [${alert.severity.toUpperCase()}] ${alert.message}`);
  });

  console.log('\n');
}

/**
 * Main demo runner
 */
async function main() {
  console.log('\n');
  console.log('📊 ANALYTICS DASHBOARD DEMO');
  console.log('Real-time Monitoring & Performance Analytics\n');

  try {
    await scenarioRealtimeMonitoring();
    await scenarioAlertSystem();
    await scenarioPerformanceAnalytics();
    await scenarioFullReport();
    await scenarioCustomAlerts();

    console.log('═'.repeat(80));
    console.log('✨ All scenarios completed successfully!');
    console.log('═'.repeat(80) + '\n');
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  scenarioRealtimeMonitoring,
  scenarioAlertSystem,
  scenarioPerformanceAnalytics,
  scenarioFullReport,
  scenarioCustomAlerts
};
