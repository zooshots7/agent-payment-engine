import { describe, it, expect, beforeEach } from 'vitest';
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

describe('AnalyticsDashboard', () => {
  let dashboard: AnalyticsDashboard;

  // Helper to create mock snapshot
  const createMockSnapshot = (overrides?: Partial<DashboardSnapshot>): DashboardSnapshot => {
    const timestamp = new Date();

    return {
      timestamp,
      systemHealth: {
        uptime: 3600000, // 1 hour
        totalTransactions: 1000,
        successfulTransactions: 950,
        failedTransactions: 50,
        averageResponseTime: 150,
        activeAgents: 8,
        totalAgents: 10,
        errorRate: 0.05,
        timestamp
      },
      transactions: {
        totalVolume: 1000000,
        averageTransactionSize: 1000,
        largestTransaction: 50000,
        transactionsPerHour: 100,
        transactionsByChain: {
          solana: 600,
          ethereum: 250,
          base: 150
        },
        transactionsByStatus: {
          pending: 20,
          completed: 950,
          failed: 25,
          cancelled: 5
        }
      },
      agents: [
        {
          agentId: 'validator-1',
          role: 'validator',
          tasksCompleted: 100,
          averageTaskTime: 120,
          successRate: 0.98,
          lastActive: timestamp,
          failureCount: 2,
          utilizationRate: 0.75
        },
        {
          agentId: 'executor-1',
          role: 'executor',
          tasksCompleted: 80,
          averageTaskTime: 200,
          successRate: 0.95,
          lastActive: timestamp,
          failureCount: 4,
          utilizationRate: 0.80
        }
      ],
      yield: {
        totalValueLocked: 5000000,
        currentAPY: 12.5,
        protocolDistribution: {
          kamino: 2500000,
          marginfi: 1500000,
          drift: 1000000
        },
        rebalanceCount: 10,
        profitGenerated: 50000,
        lastRebalance: timestamp,
        performanceVsBaseline: 5.2
      },
      fraud: {
        totalChecked: 1000,
        flaggedCount: 15,
        blockedCount: 8,
        falsePositiveRate: 0.02,
        fraudPrevented: 125000,
        topRiskFactors: [
          { factor: 'velocity', count: 5 },
          { factor: 'amount', count: 3 }
        ],
        detectionAccuracy: 0.92
      },
      routing: {
        totalRoutesCalculated: 500,
        averageHops: 2.3,
        costSavings: 25000,
        averageExecutionTime: 1500,
        bridgeUsage: {
          wormhole: 200,
          mayan: 150,
          allbridge: 150
        },
        chainUsage: {
          solana: 300,
          ethereum: 150,
          base: 50
        }
      },
      pricing: {
        averagePrice: 10.5,
        priceVolatility: 1.2,
        conversionRate: 0.65,
        revenueGenerated: 100000,
        abTestsRunning: 3,
        winningVariants: [
          { variant: 'variant-a', improvement: 5.2 }
        ]
      },
      ...overrides
    };
  };

  beforeEach(() => {
    dashboard = new AnalyticsDashboard();
  });

  describe('Initialization', () => {
    it('should initialize with empty snapshots', () => {
      expect(dashboard.getSnapshotCount()).toBe(0);
    });

    it('should initialize with default alert rules', () => {
      const alerts = dashboard.getActiveAlerts();
      expect(alerts).toHaveLength(0);
    });

    it('should track uptime from initialization', () => {
      const uptime = dashboard.getUptime();
      expect(uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Snapshot Recording', () => {
    it('should record snapshot successfully', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      expect(dashboard.getSnapshotCount()).toBe(1);
    });

    it('should record multiple snapshots', () => {
      for (let i = 0; i < 5; i++) {
        dashboard.recordSnapshot(createMockSnapshot());
      }

      expect(dashboard.getSnapshotCount()).toBe(5);
    });

    it('should limit snapshot history', () => {
      // Record more than max
      for (let i = 0; i < 1100; i++) {
        dashboard.recordSnapshot(createMockSnapshot());
      }

      expect(dashboard.getSnapshotCount()).toBeLessThanOrEqual(1000);
    });
  });

  describe('System Health', () => {
    it('should return null when no snapshots', () => {
      const health = dashboard.getSystemHealth();
      expect(health).toBeNull();
    });

    it('should return latest system health', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const health = dashboard.getSystemHealth();
      expect(health).toBeDefined();
      expect(health?.totalTransactions).toBe(1000);
      expect(health?.activeAgents).toBe(8);
    });

    it('should update with new snapshots', () => {
      dashboard.recordSnapshot(createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          totalTransactions: 1000
        }
      }));

      dashboard.recordSnapshot(createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          totalTransactions: 1500
        }
      }));

      const health = dashboard.getSystemHealth();
      expect(health?.totalTransactions).toBe(1500);
    });
  });

  describe('Transaction Metrics', () => {
    it('should return transaction metrics', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const metrics = dashboard.getTransactionMetrics();
      expect(metrics).toBeDefined();
      expect(metrics?.totalVolume).toBe(1000000);
      expect(metrics?.averageTransactionSize).toBe(1000);
    });

    it('should track transactions by chain', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const metrics = dashboard.getTransactionMetrics();
      expect(metrics?.transactionsByChain).toHaveProperty('solana');
      expect(metrics?.transactionsByChain.solana).toBe(600);
    });

    it('should track transactions by status', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const metrics = dashboard.getTransactionMetrics();
      expect(metrics?.transactionsByStatus.completed).toBe(950);
      expect(metrics?.transactionsByStatus.failed).toBe(25);
    });
  });

  describe('Agent Performance', () => {
    it('should return top performing agents', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const topAgents = dashboard.getTopPerformingAgents(5);
      expect(topAgents.length).toBeGreaterThan(0);
    });

    it('should sort agents by success rate', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const topAgents = dashboard.getTopPerformingAgents(10);
      
      // Check if sorted descending by success rate
      for (let i = 0; i < topAgents.length - 1; i++) {
        expect(topAgents[i].successRate).toBeGreaterThanOrEqual(topAgents[i + 1].successRate);
      }
    });

    it('should limit returned agents', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const topAgents = dashboard.getTopPerformingAgents(1);
      expect(topAgents.length).toBe(1);
    });
  });

  describe('Yield Performance', () => {
    it('should track yield performance history', () => {
      // Record snapshots over time
      for (let i = 0; i < 5; i++) {
        dashboard.recordSnapshot(createMockSnapshot());
      }

      const history = dashboard.getYieldPerformanceHistory(24);
      expect(history.length).toBe(5);
    });

    it('should return APY and TVL over time', () => {
      dashboard.recordSnapshot(createMockSnapshot());

      const history = dashboard.getYieldPerformanceHistory(24);
      expect(history[0]).toHaveProperty('apy');
      expect(history[0]).toHaveProperty('tvl');
      expect(history[0]).toHaveProperty('timestamp');
    });

    it('should filter by time window', () => {
      const now = Date.now();
      
      // Old snapshot (25 hours ago)
      const oldSnapshot = createMockSnapshot();
      oldSnapshot.timestamp = new Date(now - 25 * 60 * 60 * 1000);
      dashboard.recordSnapshot(oldSnapshot);

      // Recent snapshot
      const recentSnapshot = createMockSnapshot();
      recentSnapshot.timestamp = new Date(now);
      dashboard.recordSnapshot(recentSnapshot);

      const history = dashboard.getYieldPerformanceHistory(24); // Last 24 hours
      expect(history.length).toBe(1); // Only recent snapshot
    });
  });

  describe('Fraud Detection', () => {
    it('should return fraud statistics', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const stats = dashboard.getFraudStats();
      expect(stats).toBeDefined();
      expect(stats?.totalChecked).toBe(1000);
      expect(stats?.flaggedCount).toBe(15);
      expect(stats?.blockedCount).toBe(8);
    });

    it('should track fraud prevented value', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const stats = dashboard.getFraudStats();
      expect(stats?.fraudPrevented).toBe(125000);
    });

    it('should track top risk factors', () => {
      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const stats = dashboard.getFraudStats();
      expect(stats?.topRiskFactors).toHaveLength(2);
      expect(stats?.topRiskFactors[0].factor).toBe('velocity');
    });
  });

  describe('Routing Efficiency', () => {
    it('should track routing efficiency over time', () => {
      for (let i = 0; i < 3; i++) {
        dashboard.recordSnapshot(createMockSnapshot());
      }

      const efficiency = dashboard.getRoutingEfficiency(24);
      expect(efficiency.length).toBe(3);
    });

    it('should return average hops and cost savings', () => {
      dashboard.recordSnapshot(createMockSnapshot());

      const efficiency = dashboard.getRoutingEfficiency(24);
      expect(efficiency[0]).toHaveProperty('avgHops');
      expect(efficiency[0]).toHaveProperty('costSavings');
    });
  });

  describe('Alert System', () => {
    it('should create alert when threshold exceeded', () => {
      const snapshot = createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          errorRate: 0.10 // 10% - above 5% threshold
        }
      });

      dashboard.recordSnapshot(snapshot);

      const alerts = dashboard.getActiveAlerts();
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should not create alert when within threshold', () => {
      const snapshot = createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          errorRate: 0.02 // 2% - below 5% threshold
        },
        fraud: {
          ...createMockSnapshot().fraud,
          flaggedCount: 5 // Below 10 threshold
        }
      });

      dashboard.recordSnapshot(snapshot);

      const alerts = dashboard.getActiveAlerts();
      expect(alerts).toHaveLength(0);
    });

    it('should acknowledge alerts', () => {
      const snapshot = createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          errorRate: 0.10
        },
        fraud: {
          ...createMockSnapshot().fraud,
          flaggedCount: 5 // Don't trigger fraud alert
        }
      });

      dashboard.recordSnapshot(snapshot);

      const alerts = dashboard.getActiveAlerts();
      expect(alerts.length).toBeGreaterThan(0);

      const alertId = alerts[0].id;
      const acknowledged = dashboard.acknowledgeAlert(alertId);

      expect(acknowledged).toBe(true);
      expect(dashboard.getActiveAlerts().length).toBe(0);
    });

    it('should add custom alert rules', () => {
      const ruleId = dashboard.addAlertRule({
        name: 'Custom Rule',
        metric: 'transactions.totalVolume',
        condition: 'above',
        threshold: 5000000,
        enabled: true,
        severity: 'high'
      });

      expect(ruleId).toBeDefined();
      expect(ruleId).toContain('rule-');
    });

    it('should trigger custom alert rules', () => {
      dashboard.addAlertRule({
        name: 'High Volume',
        metric: 'transactions.totalVolume',
        condition: 'above',
        threshold: 500000, // Low threshold
        enabled: true,
        severity: 'high'
      });

      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const alerts = dashboard.getActiveAlerts();
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should respect disabled alert rules', () => {
      dashboard.addAlertRule({
        name: 'Disabled Rule',
        metric: 'systemHealth.errorRate',
        condition: 'above',
        threshold: 0.01, // Very low threshold
        enabled: false, // Disabled
        severity: 'low'
      });

      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      const alerts = dashboard.getActiveAlerts();
      // Should only have default alerts, not the disabled one
      const disabledRuleAlerts = alerts.filter(a => a.message.includes('Disabled Rule'));
      expect(disabledRuleAlerts).toHaveLength(0);
    });
  });

  describe('Aggregate Statistics', () => {
    it('should calculate aggregate stats over time period', () => {
      dashboard.recordSnapshot(createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          totalTransactions: 1000,
          successfulTransactions: 950
        }
      }));

      dashboard.recordSnapshot(createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          totalTransactions: 1500,
          successfulTransactions: 1425
        }
      }));

      const stats = dashboard.getAggregateStats(24);
      expect(stats.totalTransactions).toBe(500); // 1500 - 1000
    });

    it('should calculate average success rate', () => {
      // Need at least 2 snapshots for proper delta calculation
      dashboard.recordSnapshot(createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          totalTransactions: 1000,
          successfulTransactions: 950
        }
      }));

      dashboard.recordSnapshot(createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          totalTransactions: 1100,
          successfulTransactions: 1045
        }
      }));

      const stats = dashboard.getAggregateStats(24);
      expect(stats.averageSuccessRate).toBeGreaterThan(0);
      expect(stats.averageSuccessRate).toBeLessThanOrEqual(1);
    });

    it('should return zero stats when no snapshots', () => {
      const stats = dashboard.getAggregateStats(24);
      expect(stats.totalTransactions).toBe(0);
      expect(stats.totalVolume).toBe(0);
    });
  });

  describe('Report Generation', () => {
    it('should generate text report', () => {
      dashboard.recordSnapshot(createMockSnapshot());

      const report = dashboard.generateReport();
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });

    it('should include all metric sections', () => {
      dashboard.recordSnapshot(createMockSnapshot());

      const report = dashboard.generateReport();
      expect(report).toContain('SYSTEM HEALTH');
      expect(report).toContain('TRANSACTIONS');
      expect(report).toContain('YIELD OPTIMIZATION');
      expect(report).toContain('FRAUD DETECTION');
      expect(report).toContain('ROUTE OPTIMIZATION');
      expect(report).toContain('DYNAMIC PRICING');
    });

    it('should show active alerts in report', () => {
      const snapshot = createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          errorRate: 0.10 // Trigger alert
        }
      });

      dashboard.recordSnapshot(snapshot);

      const report = dashboard.generateReport();
      expect(report).toContain('ACTIVE ALERTS');
    });

    it('should handle no data gracefully', () => {
      const report = dashboard.generateReport();
      expect(report).toContain('No data available');
    });
  });

  describe('Data Management', () => {
    it('should clear snapshots', () => {
      for (let i = 0; i < 10; i++) {
        dashboard.recordSnapshot(createMockSnapshot());
      }

      expect(dashboard.getSnapshotCount()).toBe(10);

      dashboard.clearSnapshots();
      expect(dashboard.getSnapshotCount()).toBe(0);
    });

    it('should clear alerts', () => {
      const snapshot = createMockSnapshot({
        systemHealth: {
          ...createMockSnapshot().systemHealth,
          errorRate: 0.10
        }
      });

      dashboard.recordSnapshot(snapshot);
      expect(dashboard.getActiveAlerts().length).toBeGreaterThan(0);

      dashboard.clearAlerts();
      expect(dashboard.getActiveAlerts().length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing metric paths', () => {
      dashboard.addAlertRule({
        name: 'Invalid Path',
        metric: 'nonexistent.metric.path',
        condition: 'above',
        threshold: 100,
        enabled: true,
        severity: 'low'
      });

      const snapshot = createMockSnapshot();
      dashboard.recordSnapshot(snapshot);

      // Should not crash, just no alert triggered
      const alerts = dashboard.getActiveAlerts();
      const invalidPathAlerts = alerts.filter(a => a.message.includes('Invalid Path'));
      expect(invalidPathAlerts).toHaveLength(0);
    });

    it('should handle empty agent list', () => {
      const snapshot = createMockSnapshot({
        agents: []
      });

      dashboard.recordSnapshot(snapshot);

      const topAgents = dashboard.getTopPerformingAgents(10);
      expect(topAgents).toHaveLength(0);
    });

    it('should handle future time windows', () => {
      const pastSnapshot = createMockSnapshot();
      pastSnapshot.timestamp = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      dashboard.recordSnapshot(pastSnapshot);

      const history = dashboard.getYieldPerformanceHistory(1); // Last 1 hour
      expect(history).toHaveLength(0); // Should be empty since snapshot is 25 hours old
    });
  });
});
