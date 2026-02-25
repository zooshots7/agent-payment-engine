/**
 * Analytics Dashboard
 * 
 * Real-time monitoring and analytics for the payment engine:
 * - System health metrics
 * - Transaction analytics
 * - Agent performance
 * - Yield optimization tracking
 * - Fraud detection stats
 * - Route efficiency
 */

export interface SystemHealthMetrics {
  uptime: number; // milliseconds
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageResponseTime: number; // milliseconds
  activeAgents: number;
  totalAgents: number;
  errorRate: number; // 0-1
  timestamp: Date;
}

export interface TransactionMetrics {
  totalVolume: number; // USD
  averageTransactionSize: number; // USD
  largestTransaction: number; // USD
  transactionsPerHour: number;
  transactionsByChain: Record<string, number>;
  transactionsByStatus: {
    pending: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
}

export interface AgentPerformanceMetrics {
  agentId: string;
  role: string;
  tasksCompleted: number;
  averageTaskTime: number; // milliseconds
  successRate: number; // 0-1
  lastActive: Date;
  failureCount: number;
  utilizationRate: number; // 0-1 (time busy vs time available)
}

export interface YieldMetrics {
  totalValueLocked: number; // USD
  currentAPY: number; // percentage
  protocolDistribution: Record<string, number>; // protocol -> amount
  rebalanceCount: number;
  profitGenerated: number; // USD
  lastRebalance: Date;
  performanceVsBaseline: number; // percentage improvement
}

export interface FraudMetrics {
  totalChecked: number;
  flaggedCount: number;
  blockedCount: number;
  falsePositiveRate: number; // 0-1
  fraudPrevented: number; // USD value
  topRiskFactors: Array<{ factor: string; count: number }>;
  detectionAccuracy: number; // 0-1
}

export interface RouteMetrics {
  totalRoutesCalculated: number;
  averageHops: number;
  costSavings: number; // USD
  averageExecutionTime: number; // milliseconds
  bridgeUsage: Record<string, number>; // bridge -> usage count
  chainUsage: Record<string, number>; // chain -> usage count
}

export interface PricingMetrics {
  averagePrice: number;
  priceVolatility: number; // standard deviation
  conversionRate: number; // 0-1
  revenueGenerated: number; // USD
  abTestsRunning: number;
  winningVariants: Array<{ variant: string; improvement: number }>;
}

export interface DashboardSnapshot {
  timestamp: Date;
  systemHealth: SystemHealthMetrics;
  transactions: TransactionMetrics;
  agents: AgentPerformanceMetrics[];
  yield: YieldMetrics;
  fraud: FraudMetrics;
  routing: RouteMetrics;
  pricing: PricingMetrics;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Alert {
  id: string;
  ruleId: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  acknowledged: boolean;
}

export class AnalyticsDashboard {
  private snapshots: DashboardSnapshot[] = [];
  private alerts: Alert[] = [];
  private alertRules: AlertRule[] = [];
  private maxSnapshotHistory = 1000; // Keep last 1000 snapshots
  private startTime: Date;

  constructor() {
    this.startTime = new Date();
    this.initializeDefaultAlertRules();
  }

  /**
   * Initialize default alert rules
   */
  private initializeDefaultAlertRules(): void {
    this.alertRules = [
      {
        id: 'error-rate-high',
        name: 'High Error Rate',
        metric: 'systemHealth.errorRate',
        condition: 'above',
        threshold: 0.05, // 5%
        enabled: true,
        severity: 'high'
      },
      {
        id: 'response-time-slow',
        name: 'Slow Response Time',
        metric: 'systemHealth.averageResponseTime',
        condition: 'above',
        threshold: 5000, // 5 seconds
        enabled: true,
        severity: 'medium'
      },
      {
        id: 'fraud-spike',
        name: 'Fraud Detection Spike',
        metric: 'fraud.flaggedCount',
        condition: 'above',
        threshold: 10, // per snapshot
        enabled: true,
        severity: 'critical'
      },
      {
        id: 'agent-low-availability',
        name: 'Low Agent Availability',
        metric: 'systemHealth.activeAgents',
        condition: 'below',
        threshold: 3,
        enabled: true,
        severity: 'high'
      },
      {
        id: 'yield-drop',
        name: 'Yield Performance Drop',
        metric: 'yield.performanceVsBaseline',
        condition: 'below',
        threshold: -10, // 10% worse than baseline
        enabled: true,
        severity: 'medium'
      }
    ];
  }

  /**
   * Record a new snapshot of all metrics
   */
  recordSnapshot(snapshot: DashboardSnapshot): void {
    this.snapshots.push(snapshot);

    // Trim old snapshots
    if (this.snapshots.length > this.maxSnapshotHistory) {
      this.snapshots = this.snapshots.slice(-this.maxSnapshotHistory);
    }

    // Check alert rules
    this.checkAlertRules(snapshot);
  }

  /**
   * Check all alert rules against current snapshot
   */
  private checkAlertRules(snapshot: DashboardSnapshot): void {
    for (const rule of this.alertRules) {
      if (!rule.enabled) continue;

      const value = this.getMetricValue(snapshot, rule.metric);
      if (value === null) continue;

      let triggered = false;
      switch (rule.condition) {
        case 'above':
          triggered = value > rule.threshold;
          break;
        case 'below':
          triggered = value < rule.threshold;
          break;
        case 'equals':
          triggered = value === rule.threshold;
          break;
      }

      if (triggered) {
        this.createAlert(rule, value, snapshot.timestamp);
      }
    }
  }

  /**
   * Get metric value from snapshot by path
   */
  private getMetricValue(snapshot: DashboardSnapshot, path: string): number | null {
    const parts = path.split('.');
    let value: any = snapshot;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return null;
      }
    }

    return typeof value === 'number' ? value : null;
  }

  /**
   * Create a new alert
   */
  private createAlert(rule: AlertRule, value: number, timestamp: Date): void {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      timestamp,
      severity: rule.severity,
      metric: rule.metric,
      value,
      threshold: rule.threshold,
      message: this.generateAlertMessage(rule, value),
      acknowledged: false
    };

    this.alerts.push(alert);
    console.log(`🚨 [${alert.severity.toUpperCase()}] ${alert.message}`);
  }

  /**
   * Generate human-readable alert message
   */
  private generateAlertMessage(rule: AlertRule, value: number): string {
    return `${rule.name}: ${rule.metric} is ${value.toFixed(2)} (threshold: ${rule.threshold})`;
  }

  /**
   * Get current system health
   */
  getSystemHealth(): SystemHealthMetrics | null {
    if (this.snapshots.length === 0) return null;
    return this.snapshots[this.snapshots.length - 1].systemHealth;
  }

  /**
   * Get transaction metrics
   */
  getTransactionMetrics(): TransactionMetrics | null {
    if (this.snapshots.length === 0) return null;
    return this.snapshots[this.snapshots.length - 1].transactions;
  }

  /**
   * Get agent performance rankings
   */
  getTopPerformingAgents(limit: number = 10): AgentPerformanceMetrics[] {
    if (this.snapshots.length === 0) return [];

    const latestSnapshot = this.snapshots[this.snapshots.length - 1];
    return latestSnapshot.agents
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, limit);
  }

  /**
   * Get yield performance over time
   */
  getYieldPerformanceHistory(hours: number = 24): Array<{ timestamp: Date; apy: number; tvl: number }> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return this.snapshots
      .filter(s => s.timestamp >= cutoff)
      .map(s => ({
        timestamp: s.timestamp,
        apy: s.yield.currentAPY,
        tvl: s.yield.totalValueLocked
      }));
  }

  /**
   * Get fraud detection statistics
   */
  getFraudStats(): FraudMetrics | null {
    if (this.snapshots.length === 0) return null;
    return this.snapshots[this.snapshots.length - 1].fraud;
  }

  /**
   * Get routing efficiency over time
   */
  getRoutingEfficiency(hours: number = 24): Array<{ timestamp: Date; avgHops: number; costSavings: number }> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return this.snapshots
      .filter(s => s.timestamp >= cutoff)
      .map(s => ({
        timestamp: s.timestamp,
        avgHops: s.routing.averageHops,
        costSavings: s.routing.costSavings
      }));
  }

  /**
   * Get active alerts (unacknowledged)
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.acknowledged);
  }

  /**
   * Get all alerts
   */
  getAllAlerts(limit?: number): Alert[] {
    const sorted = this.alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  /**
   * Add custom alert rule
   */
  addAlertRule(rule: Omit<AlertRule, 'id'>): string {
    const id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.alertRules.push({ id, ...rule });
    return id;
  }

  /**
   * Calculate aggregate statistics
   */
  getAggregateStats(hours: number = 24): {
    totalTransactions: number;
    totalVolume: number;
    averageSuccessRate: number;
    totalFraudPrevented: number;
    totalCostSavings: number;
  } {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentSnapshots = this.snapshots.filter(s => s.timestamp >= cutoff);

    if (recentSnapshots.length === 0) {
      return {
        totalTransactions: 0,
        totalVolume: 0,
        averageSuccessRate: 0,
        totalFraudPrevented: 0,
        totalCostSavings: 0
      };
    }

    const latest = recentSnapshots[recentSnapshots.length - 1];
    const oldest = recentSnapshots[0];

    const totalTransactions = latest.systemHealth.totalTransactions - oldest.systemHealth.totalTransactions;
    const successfulTransactions = latest.systemHealth.successfulTransactions - oldest.systemHealth.successfulTransactions;

    return {
      totalTransactions,
      totalVolume: latest.transactions.totalVolume,
      averageSuccessRate: totalTransactions > 0 ? successfulTransactions / totalTransactions : 0,
      totalFraudPrevented: latest.fraud.fraudPrevented,
      totalCostSavings: latest.routing.costSavings
    };
  }

  /**
   * Generate text report
   */
  generateReport(): string {
    if (this.snapshots.length === 0) {
      return 'No data available for report generation.';
    }

    const latest = this.snapshots[this.snapshots.length - 1];
    const stats = this.getAggregateStats(24);
    const activeAlerts = this.getActiveAlerts();

    const lines: string[] = [];
    lines.push('═'.repeat(80));
    lines.push('AGENT PAYMENT ENGINE - ANALYTICS REPORT');
    lines.push('═'.repeat(80));
    lines.push('');

    // System Health
    lines.push('📊 SYSTEM HEALTH');
    lines.push('─'.repeat(80));
    lines.push(`  Uptime: ${(latest.systemHealth.uptime / 1000 / 60 / 60).toFixed(2)} hours`);
    lines.push(`  Active Agents: ${latest.systemHealth.activeAgents}/${latest.systemHealth.totalAgents}`);
    lines.push(`  Error Rate: ${(latest.systemHealth.errorRate * 100).toFixed(2)}%`);
    lines.push(`  Avg Response Time: ${latest.systemHealth.averageResponseTime.toFixed(0)}ms`);
    lines.push('');

    // Transactions
    lines.push('💳 TRANSACTIONS (24h)');
    lines.push('─'.repeat(80));
    lines.push(`  Total: ${stats.totalTransactions.toLocaleString()}`);
    lines.push(`  Volume: $${stats.totalVolume.toLocaleString()}`);
    lines.push(`  Success Rate: ${(stats.averageSuccessRate * 100).toFixed(2)}%`);
    lines.push(`  Avg Size: $${latest.transactions.averageTransactionSize.toFixed(2)}`);
    lines.push(`  Largest: $${latest.transactions.largestTransaction.toLocaleString()}`);
    lines.push('');

    // Yield
    lines.push('📈 YIELD OPTIMIZATION');
    lines.push('─'.repeat(80));
    lines.push(`  TVL: $${latest.yield.totalValueLocked.toLocaleString()}`);
    lines.push(`  Current APY: ${latest.yield.currentAPY.toFixed(2)}%`);
    lines.push(`  Profit Generated: $${latest.yield.profitGenerated.toLocaleString()}`);
    lines.push(`  vs Baseline: ${latest.yield.performanceVsBaseline > 0 ? '+' : ''}${latest.yield.performanceVsBaseline.toFixed(2)}%`);
    lines.push(`  Rebalances: ${latest.yield.rebalanceCount}`);
    lines.push('');

    // Fraud
    lines.push('🛡️  FRAUD DETECTION');
    lines.push('─'.repeat(80));
    lines.push(`  Transactions Checked: ${latest.fraud.totalChecked.toLocaleString()}`);
    lines.push(`  Flagged: ${latest.fraud.flaggedCount}`);
    lines.push(`  Blocked: ${latest.fraud.blockedCount}`);
    lines.push(`  Fraud Prevented: $${stats.totalFraudPrevented.toLocaleString()}`);
    lines.push(`  Detection Accuracy: ${(latest.fraud.detectionAccuracy * 100).toFixed(2)}%`);
    lines.push('');

    // Routing
    lines.push('🌐 ROUTE OPTIMIZATION');
    lines.push('─'.repeat(80));
    lines.push(`  Routes Calculated: ${latest.routing.totalRoutesCalculated.toLocaleString()}`);
    lines.push(`  Avg Hops: ${latest.routing.averageHops.toFixed(2)}`);
    lines.push(`  Cost Savings: $${stats.totalCostSavings.toLocaleString()}`);
    lines.push(`  Avg Execution: ${latest.routing.averageExecutionTime.toFixed(0)}ms`);
    lines.push('');

    // Pricing
    lines.push('💰 DYNAMIC PRICING');
    lines.push('─'.repeat(80));
    lines.push(`  Avg Price: $${latest.pricing.averagePrice.toFixed(2)}`);
    lines.push(`  Conversion Rate: ${(latest.pricing.conversionRate * 100).toFixed(2)}%`);
    lines.push(`  Revenue: $${latest.pricing.revenueGenerated.toLocaleString()}`);
    lines.push(`  A/B Tests Running: ${latest.pricing.abTestsRunning}`);
    lines.push('');

    // Alerts
    if (activeAlerts.length > 0) {
      lines.push('🚨 ACTIVE ALERTS');
      lines.push('─'.repeat(80));
      activeAlerts.slice(0, 5).forEach(alert => {
        lines.push(`  [${alert.severity.toUpperCase()}] ${alert.message}`);
      });
      if (activeAlerts.length > 5) {
        lines.push(`  ... and ${activeAlerts.length - 5} more`);
      }
      lines.push('');
    }

    lines.push('═'.repeat(80));
    lines.push(`Report generated at: ${latest.timestamp.toISOString()}`);
    lines.push('═'.repeat(80));

    return lines.join('\n');
  }

  /**
   * Get uptime in milliseconds
   */
  getUptime(): number {
    return Date.now() - this.startTime.getTime();
  }

  /**
   * Get snapshot count
   */
  getSnapshotCount(): number {
    return this.snapshots.length;
  }

  /**
   * Clear all snapshots (use with caution)
   */
  clearSnapshots(): void {
    this.snapshots = [];
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.alerts = [];
  }
}
