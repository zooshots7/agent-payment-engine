/**
 * Fraud Detection ML System
 * 
 * Real-time fraud detection using machine learning models:
 * - Velocity checks (transaction frequency)
 * - Amount anomaly detection
 * - Behavioral pattern analysis
 * - Geo-location anomalies
 * - Known fraud signature matching
 */

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  timestamp: Date;
  fromAddress: string;
  toAddress: string;
  chain: string;
  ipAddress?: string;
  userAgent?: string;
  geoLocation?: GeoLocation;
  metadata?: Record<string, any>;
}

export interface GeoLocation {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface UserProfile {
  userId: string;
  accountAge: number; // days
  totalTransactions: number;
  totalVolume: number;
  averageAmount: number;
  commonChains: string[];
  commonAddresses: string[];
  typicalGeoLocations: string[];
  riskScore: number;
  lastActivity: Date;
}

export interface FraudSignal {
  type: 'velocity' | 'amount_anomaly' | 'pattern' | 'geo_anomaly' | 'known_fraud' | 'behavioral';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  description: string;
  metadata?: Record<string, any>;
}

export interface FraudAnalysis {
  transactionId: string;
  riskScore: number; // 0-1 (0 = safe, 1 = fraud)
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  signals: FraudSignal[];
  recommendation: 'approve' | 'flag' | 'block' | 'review';
  confidence: number;
  reasoning: string[];
}

export interface FraudConfig {
  enabled: boolean;
  models: FraudModel[];
  actions: FraudActions;
  thresholds: FraudThresholds;
  enableLearning: boolean;
  alertWebhook?: string;
}

export type FraudModel = 'velocity_check' | 'amount_anomaly' | 'pattern_recognition' | 'geo_anomaly' | 'behavioral';

export interface FraudActions {
  safe: 'approve';
  low: 'approve' | 'log';
  medium: 'flag' | 'log';
  high: 'block' | 'flag_and_notify';
  critical: 'block' | 'block_and_alert';
}

export interface FraudThresholds {
  velocity: number; // transactions per hour
  anomalyScore: number; // 0-1
  amountDeviation: number; // standard deviations
  geoDistance: number; // km
  riskScore: {
    safe: number;
    low: number;
    medium: number;
    high: number;
  };
}

export class FraudDetector {
  private config: FraudConfig;
  private userProfiles: Map<string, UserProfile> = new Map();
  private transactionHistory: Map<string, Transaction[]> = new Map();
  private knownFraudPatterns: Set<string> = new Set();
  private blockedAddresses: Set<string> = new Set();
  private modelWeights: Map<FraudModel, number> = new Map();

  constructor(config: FraudConfig) {
    this.config = config;
    this.initializeModelWeights();
    this.loadKnownFraudPatterns();
  }

  /**
   * Initialize ML model weights
   */
  private initializeModelWeights(): void {
    this.modelWeights.set('velocity_check', 0.25);
    this.modelWeights.set('amount_anomaly', 0.3);
    this.modelWeights.set('pattern_recognition', 0.2);
    this.modelWeights.set('geo_anomaly', 0.15);
    this.modelWeights.set('behavioral', 0.1);
  }

  /**
   * Load known fraud patterns (in production, load from database/API)
   */
  private loadKnownFraudPatterns(): void {
    // Mock known fraud patterns
    // In production, this would load from a fraud database
    this.knownFraudPatterns.add('rapid_small_transactions');
    this.knownFraudPatterns.add('unusual_geo_jump');
    this.knownFraudPatterns.add('round_number_pattern');
    this.knownFraudPatterns.add('sequential_amounts');
  }

  /**
   * Analyze a transaction for fraud
   */
  async analyzeTransaction(transaction: Transaction): Promise<FraudAnalysis> {
    console.log(`🔍 Analyzing transaction ${transaction.id} for fraud...`);

    // Quick check: blocked address
    if (this.isAddressBlocked(transaction.fromAddress) || 
        this.isAddressBlocked(transaction.toAddress)) {
      return this.createBlockedAnalysis(transaction);
    }

    // Get or create user profile
    const userProfile = await this.getUserProfile(transaction.userId);

    // Run all enabled fraud detection models
    const signals: FraudSignal[] = [];

    if (this.config.models.includes('velocity_check')) {
      const velocitySignals = await this.checkVelocity(transaction, userProfile);
      signals.push(...velocitySignals);
    }

    if (this.config.models.includes('amount_anomaly')) {
      const amountSignals = await this.checkAmountAnomaly(transaction, userProfile);
      signals.push(...amountSignals);
    }

    if (this.config.models.includes('pattern_recognition')) {
      const patternSignals = await this.checkPatterns(transaction, userProfile);
      signals.push(...patternSignals);
    }

    if (this.config.models.includes('geo_anomaly')) {
      const geoSignals = await this.checkGeoAnomaly(transaction, userProfile);
      signals.push(...geoSignals);
    }

    if (this.config.models.includes('behavioral')) {
      const behavioralSignals = await this.checkBehavior(transaction, userProfile);
      signals.push(...behavioralSignals);
    }

    // Calculate overall risk score
    const riskScore = this.calculateRiskScore(signals);
    const riskLevel = this.getRiskLevel(riskScore);
    const recommendation = this.getRecommendation(riskLevel);
    const confidence = this.calculateConfidence(signals);
    const reasoning = this.generateReasoning(signals);

    // Update user profile with this transaction
    await this.updateUserProfile(transaction, userProfile);

    // Store transaction
    this.storeTransaction(transaction);

    // Learn from this transaction if enabled
    if (this.config.enableLearning) {
      await this.learn(transaction, riskScore);
    }

    const analysis: FraudAnalysis = {
      transactionId: transaction.id,
      riskScore,
      riskLevel,
      signals,
      recommendation,
      confidence,
      reasoning
    };

    console.log(`✅ Analysis complete: ${riskLevel} risk (${(riskScore * 100).toFixed(1)}%)`);

    return analysis;
  }

  /**
   * Check transaction velocity (frequency)
   */
  private async checkVelocity(
    transaction: Transaction,
    profile: UserProfile
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];
    const recentTransactions = this.getRecentTransactions(transaction.userId, 3600000); // 1 hour

    const txCount = recentTransactions.length;
    const threshold = this.config.thresholds.velocity;

    if (txCount >= threshold) {
      const severity = txCount >= threshold * 2 ? 'critical' : 
                      txCount >= threshold * 1.5 ? 'high' : 'medium';

      signals.push({
        type: 'velocity',
        severity,
        confidence: Math.min(1, txCount / (threshold * 2)),
        description: `High transaction velocity: ${txCount} transactions in past hour (threshold: ${threshold})`,
        metadata: {
          transactionCount: txCount,
          threshold,
          timeWindow: '1h'
        }
      });
    }

    // Check for burst patterns (many tx in short time)
    const recentBurst = this.getRecentTransactions(transaction.userId, 300000); // 5 minutes
    if (recentBurst.length >= 5) {
      signals.push({
        type: 'velocity',
        severity: 'high',
        confidence: 0.9,
        description: `Transaction burst detected: ${recentBurst.length} transactions in 5 minutes`,
        metadata: {
          burstCount: recentBurst.length,
          timeWindow: '5m'
        }
      });
    }

    return signals;
  }

  /**
   * Check amount anomalies using statistical analysis
   */
  private async checkAmountAnomaly(
    transaction: Transaction,
    profile: UserProfile
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    // Calculate z-score (standard deviations from mean)
    const recentTransactions = this.getRecentTransactions(transaction.userId);
    if (recentTransactions.length < 3) {
      return signals; // Not enough data
    }

    const amounts = recentTransactions.map(tx => tx.amount);
    const mean = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
    const variance = amounts.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    const zScore = Math.abs((transaction.amount - mean) / stdDev);
    const threshold = this.config.thresholds.amountDeviation;

    if (zScore > threshold) {
      const severity = zScore > threshold * 2 ? 'high' : 
                      zScore > threshold * 1.5 ? 'medium' : 'low';

      signals.push({
        type: 'amount_anomaly',
        severity,
        confidence: Math.min(1, zScore / (threshold * 2)),
        description: `Unusual transaction amount: ${transaction.amount} (${zScore.toFixed(1)} std devs from mean ${mean.toFixed(2)})`,
        metadata: {
          amount: transaction.amount,
          mean,
          stdDev,
          zScore: zScore.toFixed(2),
          threshold
        }
      });
    }

    // Check for round numbers (potential test/fraud)
    if (transaction.amount % 1000 === 0 && transaction.amount >= 1000) {
      signals.push({
        type: 'amount_anomaly',
        severity: 'low',
        confidence: 0.6,
        description: `Round number amount: ${transaction.amount} (potential test transaction)`,
        metadata: {
          amount: transaction.amount
        }
      });
    }

    return signals;
  }

  /**
   * Check for known fraud patterns
   */
  private async checkPatterns(
    transaction: Transaction,
    profile: UserProfile
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];
    const recentTransactions = this.getRecentTransactions(transaction.userId, 3600000);

    // Pattern 1: Sequential amounts (100, 200, 300, etc.)
    if (recentTransactions.length >= 3) {
      const amounts = recentTransactions.slice(-3).map(tx => tx.amount);
      amounts.push(transaction.amount);
      
      const diffs = [];
      for (let i = 1; i < amounts.length; i++) {
        diffs.push(amounts[i] - amounts[i - 1]);
      }

      const isSequential = diffs.every(d => Math.abs(d - diffs[0]) < 0.01);
      if (isSequential && diffs[0] !== 0) {
        signals.push({
          type: 'pattern',
          severity: 'medium',
          confidence: 0.8,
          description: 'Sequential amount pattern detected',
          metadata: {
            amounts,
            pattern: 'sequential'
          }
        });
      }
    }

    // Pattern 2: Same amounts repeatedly
    const sameAmountCount = recentTransactions.filter(
      tx => Math.abs(tx.amount - transaction.amount) < 0.01
    ).length;

    if (sameAmountCount >= 5) {
      signals.push({
        type: 'pattern',
        severity: 'medium',
        confidence: 0.75,
        description: `Repeated same amount: ${transaction.amount} (${sameAmountCount} times)`,
        metadata: {
          amount: transaction.amount,
          count: sameAmountCount
        }
      });
    }

    // Pattern 3: Rapid address switching
    const uniqueAddresses = new Set(recentTransactions.map(tx => tx.toAddress));
    if (uniqueAddresses.size >= 10 && recentTransactions.length <= 15) {
      signals.push({
        type: 'pattern',
        severity: 'high',
        confidence: 0.85,
        description: `High address diversity: ${uniqueAddresses.size} unique addresses in ${recentTransactions.length} transactions`,
        metadata: {
          uniqueAddresses: uniqueAddresses.size,
          totalTransactions: recentTransactions.length
        }
      });
    }

    return signals;
  }

  /**
   * Check for geographical anomalies
   */
  private async checkGeoAnomaly(
    transaction: Transaction,
    profile: UserProfile
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    if (!transaction.geoLocation) {
      return signals;
    }

    // Check if location is far from typical locations
    const typicalCountries = profile.typicalGeoLocations || [];
    if (typicalCountries.length > 0 && 
        !typicalCountries.includes(transaction.geoLocation.country)) {
      signals.push({
        type: 'geo_anomaly',
        severity: 'medium',
        confidence: 0.7,
        description: `Unusual location: ${transaction.geoLocation.country} (typical: ${typicalCountries.join(', ')})`,
        metadata: {
          currentLocation: transaction.geoLocation.country,
          typicalLocations: typicalCountries
        }
      });
    }

    // Check for impossible travel (location changes too fast)
    const recentTx = this.getRecentTransactions(transaction.userId, 3600000);
    if (recentTx.length > 0 && recentTx[recentTx.length - 1].geoLocation) {
      const lastGeo = recentTx[recentTx.length - 1].geoLocation;
      const distance = this.calculateDistance(
        lastGeo.latitude,
        lastGeo.longitude,
        transaction.geoLocation.latitude,
        transaction.geoLocation.longitude
      );

      const timeDiff = (transaction.timestamp.getTime() - 
                       recentTx[recentTx.length - 1].timestamp.getTime()) / 1000 / 3600; // hours
      const maxPossibleSpeed = 900; // km/h (commercial flight)

      if (distance / timeDiff > maxPossibleSpeed) {
        signals.push({
          type: 'geo_anomaly',
          severity: 'critical',
          confidence: 0.95,
          description: `Impossible travel: ${distance.toFixed(0)}km in ${timeDiff.toFixed(1)}h`,
          metadata: {
            distance: distance.toFixed(0),
            timeDiff: timeDiff.toFixed(1),
            from: `${lastGeo.city}, ${lastGeo.country}`,
            to: `${transaction.geoLocation.city}, ${transaction.geoLocation.country}`
          }
        });
      }
    }

    return signals;
  }

  /**
   * Check behavioral patterns
   */
  private async checkBehavior(
    transaction: Transaction,
    profile: UserProfile
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    // Check account age
    if (profile.accountAge < 7 && transaction.amount > 5000) {
      signals.push({
        type: 'behavioral',
        severity: 'medium',
        confidence: 0.65,
        description: `New account (${profile.accountAge} days old) with large transaction (${transaction.amount})`,
        metadata: {
          accountAge: profile.accountAge,
          amount: transaction.amount
        }
      });
    }

    // Check for unusual chain usage
    if (!profile.commonChains.includes(transaction.chain) && profile.totalTransactions > 10) {
      signals.push({
        type: 'behavioral',
        severity: 'low',
        confidence: 0.5,
        description: `First time using ${transaction.chain} chain`,
        metadata: {
          chain: transaction.chain,
          commonChains: profile.commonChains
        }
      });
    }

    return signals;
  }

  /**
   * Calculate overall risk score from signals
   */
  private calculateRiskScore(signals: FraudSignal[]): number {
    if (signals.length === 0) return 0;

    // Weighted average based on severity and confidence
    const severityWeights = {
      low: 0.25,
      medium: 0.5,
      high: 0.75,
      critical: 1.0
    };

    let totalWeight = 0;
    let weightedSum = 0;

    signals.forEach(signal => {
      const weight = severityWeights[signal.severity] * signal.confidence;
      weightedSum += weight;
      totalWeight += 1;
    });

    return Math.min(1, weightedSum / Math.max(1, totalWeight));
  }

  /**
   * Get risk level from score
   */
  private getRiskLevel(riskScore: number): 'safe' | 'low' | 'medium' | 'high' | 'critical' {
    const thresholds = this.config.thresholds.riskScore;

    if (riskScore >= thresholds.high) return 'critical';
    if (riskScore >= thresholds.medium) return 'high';
    if (riskScore >= thresholds.low) return 'medium';
    if (riskScore >= thresholds.safe) return 'low';
    return 'safe';
  }

  /**
   * Get recommendation based on risk level
   */
  private getRecommendation(riskLevel: string): 'approve' | 'flag' | 'block' | 'review' {
    const action = this.config.actions[riskLevel as keyof FraudActions];
    
    if (action === 'approve' || action === 'log') return 'approve';
    if (action === 'flag' || action === 'flag_and_notify') return 'flag';
    if (action === 'block' || action === 'block_and_alert') return 'block';
    
    return 'review';
  }

  /**
   * Calculate confidence in the analysis
   */
  private calculateConfidence(signals: FraudSignal[]): number {
    if (signals.length === 0) return 1.0; // High confidence it's safe

    // Average confidence of all signals
    const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;

    // Boost confidence if multiple signals agree
    const agreementBonus = Math.min(0.2, signals.length * 0.05);

    return Math.min(1, avgConfidence + agreementBonus);
  }

  /**
   * Generate human-readable reasoning
   */
  private generateReasoning(signals: FraudSignal[]): string[] {
    if (signals.length === 0) {
      return ['No fraud indicators detected', 'Transaction appears normal'];
    }

    const reasoning: string[] = [];

    // Group by severity
    const critical = signals.filter(s => s.severity === 'critical');
    const high = signals.filter(s => s.severity === 'high');
    const medium = signals.filter(s => s.severity === 'medium');

    if (critical.length > 0) {
      reasoning.push(`⛔ ${critical.length} critical fraud indicator(s)`);
      critical.forEach(s => reasoning.push(`  • ${s.description}`));
    }

    if (high.length > 0) {
      reasoning.push(`🚨 ${high.length} high-risk indicator(s)`);
      high.forEach(s => reasoning.push(`  • ${s.description}`));
    }

    if (medium.length > 0) {
      reasoning.push(`⚠️  ${medium.length} medium-risk indicator(s)`);
      medium.forEach(s => reasoning.push(`  • ${s.description}`));
    }

    return reasoning;
  }

  /**
   * Get or create user profile
   */
  private async getUserProfile(userId: string): Promise<UserProfile> {
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId)!;
    }

    // Create new profile
    const profile: UserProfile = {
      userId,
      accountAge: 0, // Would fetch from database
      totalTransactions: 0,
      totalVolume: 0,
      averageAmount: 0,
      commonChains: [],
      commonAddresses: [],
      typicalGeoLocations: [],
      riskScore: 0,
      lastActivity: new Date()
    };

    this.userProfiles.set(userId, profile);
    return profile;
  }

  /**
   * Update user profile with transaction
   */
  private async updateUserProfile(
    transaction: Transaction,
    profile: UserProfile
  ): Promise<void> {
    profile.totalTransactions++;
    profile.totalVolume += transaction.amount;
    profile.averageAmount = profile.totalVolume / profile.totalTransactions;
    profile.lastActivity = transaction.timestamp;

    // Update common chains
    if (!profile.commonChains.includes(transaction.chain)) {
      profile.commonChains.push(transaction.chain);
    }

    // Update geo locations
    if (transaction.geoLocation && 
        !profile.typicalGeoLocations.includes(transaction.geoLocation.country)) {
      profile.typicalGeoLocations.push(transaction.geoLocation.country);
    }
  }

  /**
   * Store transaction in history
   */
  private storeTransaction(transaction: Transaction): void {
    if (!this.transactionHistory.has(transaction.userId)) {
      this.transactionHistory.set(transaction.userId, []);
    }

    this.transactionHistory.get(transaction.userId)!.push(transaction);

    // Keep only last 100 transactions per user
    const history = this.transactionHistory.get(transaction.userId)!;
    if (history.length > 100) {
      this.transactionHistory.set(transaction.userId, history.slice(-100));
    }
  }

  /**
   * Get recent transactions for a user
   */
  private getRecentTransactions(userId: string, timeWindow?: number): Transaction[] {
    const history = this.transactionHistory.get(userId) || [];
    
    if (!timeWindow) {
      return history;
    }

    const cutoff = Date.now() - timeWindow;
    return history.filter(tx => tx.timestamp.getTime() >= cutoff);
  }

  /**
   * Calculate distance between two geo points (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Check if address is blocked
   */
  private isAddressBlocked(address: string): boolean {
    return this.blockedAddresses.has(address);
  }

  /**
   * Create analysis for blocked address
   */
  private createBlockedAnalysis(transaction: Transaction): FraudAnalysis {
    return {
      transactionId: transaction.id,
      riskScore: 1.0,
      riskLevel: 'critical',
      signals: [{
        type: 'known_fraud',
        severity: 'critical',
        confidence: 1.0,
        description: 'Address is on blocklist'
      }],
      recommendation: 'block',
      confidence: 1.0,
      reasoning: ['⛔ Address is on known fraud blocklist', 'Transaction automatically blocked']
    };
  }

  /**
   * Learn from transaction (update models)
   */
  private async learn(transaction: Transaction, riskScore: number): Promise<void> {
    // In production, this would:
    // 1. Store labeled data
    // 2. Retrain models periodically
    // 3. Update model weights based on performance
    // 4. Adjust thresholds dynamically
  }

  /**
   * Block an address
   */
  blockAddress(address: string): void {
    this.blockedAddresses.add(address);
    console.log(`🚫 Blocked address: ${address}`);
  }

  /**
   * Unblock an address
   */
  unblockAddress(address: string): void {
    this.blockedAddresses.delete(address);
    console.log(`✅ Unblocked address: ${address}`);
  }

  /**
   * Get user profile
   */
  getProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId);
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalUsers: number;
    totalTransactions: number;
    blockedAddresses: number;
    knownPatterns: number;
  } {
    const totalTransactions = Array.from(this.transactionHistory.values())
      .reduce((sum, history) => sum + history.length, 0);

    return {
      totalUsers: this.userProfiles.size,
      totalTransactions,
      blockedAddresses: this.blockedAddresses.size,
      knownPatterns: this.knownFraudPatterns.size
    };
  }
}
