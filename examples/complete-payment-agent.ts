/**
 * Complete Payment Agent Example
 * 
 * Demonstrates a full-featured payment agent that uses:
 * - Yield optimization
 * - Route optimization
 * - Fraud detection
 * - Dynamic pricing
 * - Multi-agent swarm
 * - Analytics dashboard
 */

import { YieldOptimizer, YieldStrategy } from '../src/strategy/yield-optimizer';
import { RouteOptimizer, OptimizationStrategy as RouteStrategy } from '../src/strategy/route-optimizer';
import { FraudDetector } from '../src/ml/fraud-detector';
import { DynamicPricing } from '../src/strategy/dynamic-pricing';
import { SwarmCoordinator, SwarmConfig } from '../src/swarm/coordinator';
import { AnalyticsDashboard, DashboardSnapshot } from '../src/analytics/dashboard';

/**
 * Complete Payment Agent
 * 
 * A fully autonomous payment agent that handles:
 * - Payment routing and execution
 * - Yield optimization for idle funds
 * - Fraud detection and prevention
 * - Dynamic pricing
 * - Multi-agent coordination for complex decisions
 * - Real-time analytics and monitoring
 */
export class CompletePaymentAgent {
  private yieldOptimizer: YieldOptimizer;
  private routeOptimizer: RouteOptimizer;
  private fraudDetector: FraudDetector;
  private pricingEngine: DynamicPricing;
  private swarmCoordinator: SwarmCoordinator;
  private dashboard: AnalyticsDashboard;

  private balance: number = 100000; // $100k starting balance
  private transactionCount: number = 0;
  private successfulTransactions: number = 0;
  private failedTransactions: number = 0;
  private totalVolume: number = 0;
  private startTime: Date;

  constructor() {
    console.log('🤖 Initializing Complete Payment Agent...\n');

    // Initialize yield optimizer
    this.yieldOptimizer = new YieldOptimizer(
      this.balance,
      'balanced' as YieldStrategy
    );
    console.log('  ✓ Yield Optimizer initialized (Balanced strategy)');

    // Initialize route optimizer
    this.routeOptimizer = new RouteOptimizer({
      enabled: true,
      chains: ['solana', 'ethereum', 'base', 'arbitrum', 'polygon', 'optimism'],
      optimizeFor: 'balance',
      maxHops: 3,
      slippageTolerance: 0.5,
      bridges: ['wormhole', 'mayan', 'allbridge', 'stargate', 'hop'],
      gasMultiplier: 1.2
    });
    console.log('  ✓ Route Optimizer initialized');

    // Initialize fraud detector
    this.fraudDetector = new FraudDetector({ learningMode: true });
    console.log('  ✓ Fraud Detector initialized (Learning mode)');

    // Initialize pricing engine
    this.pricingEngine = new DynamicPricing({
      enabled: true,
      basePrice: 10.0,
      currency: 'USD',
      adjustmentFactors: [
        { name: 'demand', type: 'demand', weight: 0.4, enabled: true },
        { name: 'competitor', type: 'competitor', weight: 0.3, enabled: true },
        { name: 'time', type: 'time', weight: 0.2, enabled: true },
        { name: 'capacity', type: 'capacity', weight: 0.1, enabled: true }
      ],
      priceFloor: 5.0,
      priceCeiling: 20.0,
      updateFrequency: 'realtime',
      abTestingEnabled: true,
      learningRate: 0.1
    });
    console.log('  ✓ Dynamic Pricing initialized ($10 base price)');

    // Initialize swarm coordinator
    const swarmConfig: SwarmConfig = {
      name: 'payment-agent-swarm',
      agents: [
        { role: 'validator', count: 2, votingWeight: 1.0 },
        { role: 'executor', count: 2, votingWeight: 1.2 },
        { role: 'risk-assessor', count: 1, votingWeight: 2.0 },
        { role: 'optimizer', count: 1, votingWeight: 1.0 }
      ],
      consensusThreshold: 0.7,
      timeoutSeconds: 30,
      maxRetries: 3,
      failureRecoveryEnabled: true
    };
    this.swarmCoordinator = new SwarmCoordinator(swarmConfig);
    console.log('  ✓ Swarm Coordinator initialized (6 agents)');

    // Initialize analytics dashboard
    this.dashboard = new AnalyticsDashboard();
    console.log('  ✓ Analytics Dashboard initialized');

    this.startTime = new Date();

    console.log('\n✅ Payment Agent ready!\n');
  }

  /**
   * Process a payment request
   */
  async processPayment(
    from: string,
    to: string,
    amount: number,
    fromChain: string,
    toChain: string,
    metadata?: { location?: string; userId?: string }
  ): Promise<{
    success: boolean;
    txHash?: string;
    route?: any;
    price?: number;
    fraudScore?: number;
    message?: string;
  }> {
    console.log('═'.repeat(80));
    console.log(`💳 Processing Payment Request`);
    console.log('═'.repeat(80));
    console.log(`  From: ${from} (${fromChain})`);
    console.log(`  To: ${to} (${toChain})`);
    console.log(`  Amount: $${amount.toLocaleString()}`);
    console.log('');

    this.transactionCount++;

    try {
      // Step 1: Fraud Detection
      console.log('Step 1: Fraud Detection');
      const fraudCheck = this.fraudDetector.analyzeTransaction({
        id: `tx-${Date.now()}`,
        userId: metadata?.userId || from,
        amount,
        recipient: to,
        chain: fromChain,
        timestamp: new Date(),
        location: metadata?.location
      });

      console.log(`  Risk Score: ${(fraudCheck.riskScore * 100).toFixed(1)}%`);
      console.log(`  Risk Level: ${fraudCheck.riskLevel}`);
      console.log(`  Recommendation: ${fraudCheck.recommendation}`);

      if (fraudCheck.recommendation === 'block') {
        console.log('  ❌ Transaction BLOCKED by fraud detection\n');
        this.failedTransactions++;
        return {
          success: false,
          fraudScore: fraudCheck.riskScore,
          message: 'Transaction blocked due to fraud risk'
        };
      }

      if (fraudCheck.recommendation === 'review') {
        console.log('  ⚠️  Transaction requires manual review');
      }

      console.log('');

      // Step 2: Dynamic Pricing
      console.log('Step 2: Dynamic Pricing');
      const factors = {
        demandMultiplier: 1.0 + Math.random() * 0.2, // 1.0-1.2x
        competitorPrices: [
          { price: 9.5, marketShare: 0.3 },
          { price: 10.5, marketShare: 0.4 },
          { price: 11.0, marketShare: 0.3 }
        ],
        timeOfDay: new Date().getHours() >= 9 && new Date().getHours() <= 17 ? 1.1 : 0.9,
        capacityUtilization: 0.7
      };

      const price = this.pricingEngine.calculatePrice(factors);
      console.log(`  Base Price: $10.00`);
      console.log(`  Dynamic Price: $${price.price.toFixed(2)}`);
      console.log(`  Factors: Demand ${factors.demandMultiplier.toFixed(2)}x, Time ${factors.timeOfDay}x`);
      console.log('');

      // Step 3: Swarm Consensus for High-Value Transactions
      if (amount > 10000) {
        console.log('Step 3: Swarm Consensus (High-Value Transaction)');
        const consensus = await this.swarmCoordinator.requestConsensus(
          'approve_high_value_payment',
          {
            amount,
            from,
            to,
            fraudScore: fraudCheck.riskScore,
            riskLevel: fraudCheck.riskLevel
          }
        );

        console.log(`  Consensus: ${consensus.decision ? '✅ APPROVED' : '❌ REJECTED'}`);
        console.log(`  Confidence: ${(consensus.confidence * 100).toFixed(1)}%`);
        console.log(`  Votes: ${consensus.votes.filter(v => v.decision).length}/${consensus.votes.length} approved`);

        if (!consensus.decision) {
          console.log('  ❌ Transaction REJECTED by swarm\n');
          this.failedTransactions++;
          return {
            success: false,
            fraudScore: fraudCheck.riskScore,
            message: 'Transaction rejected by swarm consensus'
          };
        }

        console.log('');
      }

      // Step 4: Route Optimization
      console.log('Step 4: Route Optimization');
      const route = this.routeOptimizer.findOptimalRoute(
        fromChain,
        toChain,
        amount,
        'balanced' as RouteStrategy
      );

      if (!route) {
        console.log('  ❌ No valid route found\n');
        this.failedTransactions++;
        return {
          success: false,
          message: 'No valid payment route found'
        };
      }

      console.log(`  Route: ${route.path.join(' → ')}`);
      console.log(`  Hops: ${route.path.length - 1}`);
      console.log(`  Total Cost: $${route.totalCost.toFixed(2)}`);
      console.log(`  Est. Time: ${route.estimatedTime}ms`);
      console.log(`  Bridge: ${route.bridges.join(', ')}`);
      console.log('');

      // Step 5: Execute Payment
      console.log('Step 5: Execute Payment');
      const taskId = this.swarmCoordinator.submitTask('execute', {
        route,
        amount,
        from,
        to,
        price: price.price
      }, 10);

      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 200));

      const task = this.swarmCoordinator.getTaskStatus(taskId);
      const txHash = task?.result?.txHash;

      console.log(`  Status: ${task?.status}`);
      console.log(`  Transaction Hash: ${txHash}`);
      console.log(`  Gas Used: ${task?.result?.gasUsed || 'N/A'}`);
      console.log('');

      // Update balances
      this.balance -= (amount + route.totalCost + price.price);
      this.totalVolume += amount;
      this.successfulTransactions++;

      console.log('✅ Payment Completed Successfully!\n');

      // Record analytics
      this.recordAnalytics();

      return {
        success: true,
        txHash,
        route,
        price: price.price,
        fraudScore: fraudCheck.riskScore,
        message: 'Payment completed successfully'
      };

    } catch (error) {
      console.error('❌ Payment failed:', error);
      this.failedTransactions++;
      return {
        success: false,
        message: `Payment failed: ${error}`
      };
    }
  }

  /**
   * Optimize idle funds
   */
  async optimizeYield(): Promise<void> {
    console.log('═'.repeat(80));
    console.log('💎 Optimizing Idle Funds');
    console.log('═'.repeat(80));
    console.log(`  Current Balance: $${this.balance.toLocaleString()}`);
    console.log('');

    const allocation = this.yieldOptimizer.allocateFunds();

    if (allocation.length === 0) {
      console.log('  ℹ️  No optimization needed (balance below threshold)\n');
      return;
    }

    console.log('Allocation Plan:');
    allocation.forEach((alloc, index) => {
      console.log(`  ${index + 1}. ${alloc.protocol}`);
      console.log(`     Amount: $${alloc.amount.toLocaleString()}`);
      console.log(`     APY: ${alloc.apy.toFixed(2)}%`);
      console.log(`     Risk: ${alloc.risk}`);
    });

    console.log('');
    console.log('✅ Yield optimization complete!\n');

    // Start auto-rebalancing
    this.yieldOptimizer.startAutoRebalance();
  }

  /**
   * Record analytics snapshot
   */
  private recordAnalytics(): void {
    const snapshot: DashboardSnapshot = {
      timestamp: new Date(),
      systemHealth: {
        uptime: Date.now() - this.startTime.getTime(),
        totalTransactions: this.transactionCount,
        successfulTransactions: this.successfulTransactions,
        failedTransactions: this.failedTransactions,
        averageResponseTime: 150 + Math.random() * 50,
        activeAgents: 6,
        totalAgents: 6,
        errorRate: this.failedTransactions / this.transactionCount,
        timestamp: new Date()
      },
      transactions: {
        totalVolume: this.totalVolume,
        averageTransactionSize: this.totalVolume / this.successfulTransactions || 0,
        largestTransaction: Math.max(...[5000]), // Placeholder
        transactionsPerHour: (this.transactionCount / (Date.now() - this.startTime.getTime())) * 3600000,
        transactionsByChain: {
          solana: Math.floor(this.transactionCount * 0.6),
          ethereum: Math.floor(this.transactionCount * 0.3),
          base: Math.floor(this.transactionCount * 0.1)
        },
        transactionsByStatus: {
          pending: 0,
          completed: this.successfulTransactions,
          failed: this.failedTransactions,
          cancelled: 0
        }
      },
      agents: this.swarmCoordinator.getAgents().map(agent => ({
        agentId: agent.id,
        role: agent.role,
        tasksCompleted: 10,
        averageTaskTime: 150,
        successRate: 0.95,
        lastActive: new Date(),
        failureCount: 0,
        utilizationRate: 0.7
      })),
      yield: {
        totalValueLocked: this.balance,
        currentAPY: 12.5,
        protocolDistribution: {
          kamino: this.balance * 0.5,
          marginfi: this.balance * 0.3,
          drift: this.balance * 0.2
        },
        rebalanceCount: 0,
        profitGenerated: 0,
        lastRebalance: new Date(),
        performanceVsBaseline: 5.0
      },
      fraud: {
        totalChecked: this.transactionCount,
        flaggedCount: Math.floor(this.transactionCount * 0.015),
        blockedCount: this.failedTransactions,
        falsePositiveRate: 0.02,
        fraudPrevented: this.failedTransactions * 15000,
        topRiskFactors: [
          { factor: 'velocity', count: 5 },
          { factor: 'amount', count: 3 }
        ],
        detectionAccuracy: 0.92
      },
      routing: {
        totalRoutesCalculated: this.transactionCount,
        averageHops: 2.3,
        costSavings: this.successfulTransactions * 45,
        averageExecutionTime: 1500,
        bridgeUsage: {
          wormhole: Math.floor(this.transactionCount * 0.4),
          mayan: Math.floor(this.transactionCount * 0.3),
          allbridge: Math.floor(this.transactionCount * 0.3)
        },
        chainUsage: {
          solana: Math.floor(this.transactionCount * 0.6),
          ethereum: Math.floor(this.transactionCount * 0.3),
          base: Math.floor(this.transactionCount * 0.1)
        }
      },
      pricing: {
        averagePrice: 10.5,
        priceVolatility: 1.2,
        conversionRate: this.successfulTransactions / this.transactionCount,
        revenueGenerated: this.successfulTransactions * 10,
        abTestsRunning: 2,
        winningVariants: [
          { variant: 'dynamic-pricing', improvement: 8.5 }
        ]
      }
    };

    this.dashboard.recordSnapshot(snapshot);
  }

  /**
   * Generate analytics report
   */
  generateReport(): string {
    return this.dashboard.generateReport();
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return {
      balance: this.balance,
      totalTransactions: this.transactionCount,
      successfulTransactions: this.successfulTransactions,
      failedTransactions: this.failedTransactions,
      totalVolume: this.totalVolume,
      successRate: (this.successfulTransactions / this.transactionCount) * 100,
      uptime: Date.now() - this.startTime.getTime(),
      swarmMetrics: this.swarmCoordinator.getMetrics(),
      dashboardStats: this.dashboard.getAggregateStats(24)
    };
  }

  /**
   * Shutdown agent
   */
  shutdown(): void {
    console.log('🛑 Shutting down Payment Agent...');
    
    this.yieldOptimizer.stopAutoRebalance();
    this.swarmCoordinator.shutdown();
    
    console.log('✅ Payment Agent shutdown complete');
  }
}

/**
 * Demo: Complete Payment Agent in Action
 */
async function main() {
  console.log('\n');
  console.log('🤖 COMPLETE PAYMENT AGENT DEMO');
  console.log('Full-Featured Autonomous Payment System\n');

  // Initialize agent
  const agent = new CompletePaymentAgent();

  // Scenario 1: Normal payment
  console.log('═'.repeat(80));
  console.log('SCENARIO 1: Normal Cross-Chain Payment');
  console.log('═'.repeat(80) + '\n');

  await agent.processPayment(
    'user_alice',
    'merchant_bob',
    5000,
    'solana',
    'ethereum',
    { userId: 'alice-123', location: 'US' }
  );

  // Scenario 2: High-value payment (triggers swarm consensus)
  console.log('═'.repeat(80));
  console.log('SCENARIO 2: High-Value Payment (Swarm Consensus)');
  console.log('═'.repeat(80) + '\n');

  await agent.processPayment(
    'user_charlie',
    'merchant_david',
    25000,
    'ethereum',
    'base',
    { userId: 'charlie-456', location: 'UK' }
  );

  // Scenario 3: Yield optimization
  console.log('═'.repeat(80));
  console.log('SCENARIO 3: Yield Optimization');
  console.log('═'.repeat(80) + '\n');

  await agent.optimizeYield();

  // Scenario 4: Another payment
  await agent.processPayment(
    'user_eve',
    'merchant_frank',
    3500,
    'base',
    'solana',
    { userId: 'eve-789', location: 'EU' }
  );

  // Display metrics
  console.log('═'.repeat(80));
  console.log('FINAL METRICS');
  console.log('═'.repeat(80) + '\n');

  const metrics = agent.getMetrics();
  console.log(`Balance: $${metrics.balance.toLocaleString()}`);
  console.log(`Total Transactions: ${metrics.totalTransactions}`);
  console.log(`Success Rate: ${metrics.successRate.toFixed(2)}%`);
  console.log(`Total Volume: $${metrics.totalVolume.toLocaleString()}`);
  console.log(`Uptime: ${(metrics.uptime / 1000).toFixed(0)}s`);
  console.log('');

  // Display analytics report
  console.log('═'.repeat(80));
  console.log('ANALYTICS REPORT');
  console.log('═'.repeat(80) + '\n');
  console.log(agent.generateReport());

  // Shutdown
  agent.shutdown();

  console.log('\n═'.repeat(80));
  console.log('✨ Demo completed successfully!');
  console.log('═'.repeat(80) + '\n');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
