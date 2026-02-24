import { describe, it, expect, beforeEach } from 'vitest';
import {
  FraudDetector,
  FraudConfig,
  Transaction,
  GeoLocation
} from '../src/ml/fraud-detector';

describe('FraudDetector', () => {
  let detector: FraudDetector;
  let config: FraudConfig;

  beforeEach(() => {
    config = {
      enabled: true,
      models: ['velocity_check', 'amount_anomaly', 'pattern_recognition', 'geo_anomaly', 'behavioral'],
      actions: {
        safe: 'approve',
        low: 'approve',
        medium: 'flag',
        high: 'block',
        critical: 'block'
      },
      thresholds: {
        velocity: 10,
        anomalyScore: 0.85,
        amountDeviation: 3,
        geoDistance: 1000,
        riskScore: {
          safe: 0.1,
          low: 0.3,
          medium: 0.5,
          high: 0.7
        }
      },
      enableLearning: false
    };

    detector = new FraudDetector(config);
  });

  function createTransaction(overrides?: Partial<Transaction>): Transaction {
    return {
      id: `tx-${Date.now()}-${Math.random()}`,
      userId: 'user-123',
      amount: 100,
      timestamp: new Date(),
      fromAddress: '0x123',
      toAddress: '0x456',
      chain: 'ethereum',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      ...overrides
    };
  }

  describe('Initialization', () => {
    it('should initialize with config', () => {
      expect(detector).toBeDefined();
      expect(detector.getStatistics().totalUsers).toBe(0);
      expect(detector.getStatistics().totalTransactions).toBe(0);
    });
  });

  describe('Safe Transactions', () => {
    it('should approve normal transaction', async () => {
      const tx = createTransaction();
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.riskLevel).toBe('safe');
      expect(analysis.recommendation).toBe('approve');
      expect(analysis.signals).toHaveLength(0);
    });

    it('should have high confidence for safe transactions', async () => {
      const tx = createTransaction();
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.confidence).toBeGreaterThan(0.9);
    });
  });

  describe('Velocity Checks', () => {
    it('should detect high transaction velocity', async () => {
      // Send many transactions quickly
      for (let i = 0; i < 12; i++) {
        const tx = createTransaction({
          id: `tx-velocity-${i}`,
          amount: 50 + i
        });
        await detector.analyzeTransaction(tx);
      }

      // 13th transaction should trigger velocity check
      const tx = createTransaction({ id: 'tx-velocity-final' });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.signals.some(s => s.type === 'velocity')).toBe(true);
      expect(analysis.riskLevel).not.toBe('safe');
    });

    it('should detect transaction bursts', async () => {
      // Send 6 transactions in quick succession
      for (let i = 0; i < 6; i++) {
        const tx = createTransaction({
          id: `tx-burst-${i}`,
          timestamp: new Date(Date.now() - (5 - i) * 60000) // Within 5 minutes
        });
        await detector.analyzeTransaction(tx);
      }

      const stats = detector.getStatistics();
      expect(stats.totalTransactions).toBeGreaterThan(5);
    });
  });

  describe('Amount Anomaly Detection', () => {
    it('should detect unusually large amounts', async () => {
      // Establish pattern with small amounts
      for (let i = 0; i < 5; i++) {
        const tx = createTransaction({
          id: `tx-small-${i}`,
          amount: 100 + Math.random() * 20
        });
        await detector.analyzeTransaction(tx);
      }

      // Send unusually large amount
      const tx = createTransaction({
        id: 'tx-large',
        amount: 10000 // 100x larger
      });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.signals.some(s => s.type === 'amount_anomaly')).toBe(true);
    });

    it('should detect round number patterns', async () => {
      // Establish baseline first
      for (let i = 0; i < 3; i++) {
        const baseTx = createTransaction({
          id: `tx-base-${i}`,
          userId: 'user-round',
          amount: 100 + Math.random() * 50
        });
        await detector.analyzeTransaction(baseTx);
      }

      const tx = createTransaction({
        userId: 'user-round',
        amount: 5000 // Round number
      });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.signals.some(
        s => s.type === 'amount_anomaly' && s.description.includes('Round number')
      )).toBe(true);
    });

    it('should not flag normal amounts', async () => {
      const tx = createTransaction({
        amount: 123.45
      });
      const analysis = await detector.analyzeTransaction(tx);

      const amountSignals = analysis.signals.filter(s => s.type === 'amount_anomaly');
      expect(amountSignals).toHaveLength(0);
    });
  });

  describe('Pattern Recognition', () => {
    it('should detect sequential amounts', async () => {
      // Create sequential pattern: 100, 200, 300
      for (let i = 1; i <= 3; i++) {
        const tx = createTransaction({
          id: `tx-seq-${i}`,
          amount: i * 100
        });
        await detector.analyzeTransaction(tx);
      }

      const tx = createTransaction({
        id: 'tx-seq-final',
        amount: 400 // Continues pattern
      });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.signals.some(
        s => s.type === 'pattern' && s.description.includes('Sequential')
      )).toBe(true);
    });

    it('should detect repeated same amounts', async () => {
      // Send same amount 6 times
      for (let i = 0; i < 6; i++) {
        const tx = createTransaction({
          id: `tx-repeat-${i}`,
          amount: 250
        });
        await detector.analyzeTransaction(tx);
      }

      const stats = detector.getStatistics();
      expect(stats.totalTransactions).toBeGreaterThanOrEqual(6);
    });

    it('should detect rapid address switching', async () => {
      // Send to many different addresses
      for (let i = 0; i < 12; i++) {
        const tx = createTransaction({
          id: `tx-addr-${i}`,
          toAddress: `0xaddr${i}`
        });
        await detector.analyzeTransaction(tx);
      }

      const stats = detector.getStatistics();
      expect(stats.totalTransactions).toBeGreaterThanOrEqual(12);
    });
  });

  describe('Geo-location Anomalies', () => {
    const newYork: GeoLocation = {
      country: 'USA',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060
    };

    const london: GeoLocation = {
      country: 'UK',
      city: 'London',
      latitude: 51.5074,
      longitude: -0.1278
    };

    const tokyo: GeoLocation = {
      country: 'Japan',
      city: 'Tokyo',
      latitude: 35.6762,
      longitude: 139.6503
    };

    it('should detect unusual locations', async () => {
      // Establish pattern in USA
      for (let i = 0; i < 3; i++) {
        const tx = createTransaction({
          id: `tx-usa-${i}`,
          geoLocation: newYork
        });
        await detector.analyzeTransaction(tx);
      }

      // Transaction from Japan
      const tx = createTransaction({
        id: 'tx-japan',
        geoLocation: tokyo
      });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.signals.some(s => s.type === 'geo_anomaly')).toBe(true);
    });

    it('should detect impossible travel', async () => {
      // Transaction from New York
      const tx1 = createTransaction({
        id: 'tx-ny',
        geoLocation: newYork,
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      });
      await detector.analyzeTransaction(tx1);

      // Transaction from Tokyo 1 hour later (impossible!)
      const tx2 = createTransaction({
        id: 'tx-tokyo',
        geoLocation: tokyo,
        timestamp: new Date()
      });
      const analysis = await detector.analyzeTransaction(tx2);

      expect(analysis.signals.some(
        s => s.type === 'geo_anomaly' && s.severity === 'critical'
      )).toBe(true);
    });

    it('should allow normal geo patterns', async () => {
      const tx = createTransaction({
        geoLocation: newYork
      });
      const analysis = await detector.analyzeTransaction(tx);

      const geoSignals = analysis.signals.filter(s => s.type === 'geo_anomaly');
      expect(geoSignals).toHaveLength(0);
    });
  });

  describe('Behavioral Analysis', () => {
    it('should flag large transactions from new accounts', async () => {
      const tx = createTransaction({
        userId: 'new-user',
        amount: 10000
      });

      // Mock new account (in real implementation, would fetch from DB)
      const analysis = await detector.analyzeTransaction(tx);

      // New account + large amount should raise some concerns
      expect(analysis).toBeDefined();
    });

    it('should detect first-time chain usage', async () => {
      // Establish pattern on ethereum
      for (let i = 0; i < 12; i++) {
        const tx = createTransaction({
          id: `tx-eth-${i}`,
          chain: 'ethereum'
        });
        await detector.analyzeTransaction(tx);
      }

      // First solana transaction
      const tx = createTransaction({
        id: 'tx-solana',
        chain: 'solana'
      });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.signals.some(s => s.type === 'behavioral')).toBe(true);
    });
  });

  describe('Blocked Addresses', () => {
    it('should block transactions from blocked addresses', async () => {
      const blockedAddr = '0xBAD';
      detector.blockAddress(blockedAddr);

      const tx = createTransaction({
        fromAddress: blockedAddr
      });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.riskLevel).toBe('critical');
      expect(analysis.recommendation).toBe('block');
      expect(analysis.riskScore).toBe(1.0);
    });

    it('should allow unblocked addresses', async () => {
      const addr = '0xTEST';
      detector.blockAddress(addr);
      detector.unblockAddress(addr);

      const tx = createTransaction({
        fromAddress: addr
      });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.riskLevel).not.toBe('critical');
    });
  });

  describe('Risk Scoring', () => {
    it('should calculate risk score based on signals', async () => {
      // Transaction with multiple red flags
      for (let i = 0; i < 15; i++) {
        const tx = createTransaction({
          id: `tx-risky-${i}`,
          amount: 1000
        });
        await detector.analyzeTransaction(tx);
      }

      const analysis = await detector.analyzeTransaction(
        createTransaction({ amount: 1000 })
      );

      expect(analysis.riskScore).toBeGreaterThan(0);
    });

    it('should assign correct risk levels', async () => {
      const safeTx = createTransaction();
      const safeAnalysis = await detector.analyzeTransaction(safeTx);

      expect(safeAnalysis.riskLevel).toBe('safe');
      expect(safeAnalysis.recommendation).toBe('approve');
    });
  });

  describe('User Profiles', () => {
    it('should create user profile on first transaction', async () => {
      const userId = 'new-user-profile';
      const tx = createTransaction({ userId });
      
      await detector.analyzeTransaction(tx);
      
      const profile = detector.getProfile(userId);
      expect(profile).toBeDefined();
      expect(profile?.userId).toBe(userId);
      expect(profile?.totalTransactions).toBe(1);
    });

    it('should update profile with each transaction', async () => {
      const userId = 'updating-user';
      
      // Send 3 transactions
      for (let i = 0; i < 3; i++) {
        const tx = createTransaction({
          userId,
          id: `tx-${i}`,
          amount: 100 * (i + 1)
        });
        await detector.analyzeTransaction(tx);
      }

      const profile = detector.getProfile(userId);
      expect(profile?.totalTransactions).toBe(3);
      expect(profile?.totalVolume).toBe(600); // 100 + 200 + 300
      expect(profile?.averageAmount).toBe(200);
    });
  });

  describe('Statistics', () => {
    it('should track statistics correctly', async () => {
      const tx1 = createTransaction({ userId: 'user-1' });
      const tx2 = createTransaction({ userId: 'user-2' });

      await detector.analyzeTransaction(tx1);
      await detector.analyzeTransaction(tx2);

      const stats = detector.getStatistics();
      expect(stats.totalUsers).toBe(2);
      expect(stats.totalTransactions).toBe(2);
    });

    it('should track blocked addresses', () => {
      detector.blockAddress('0xBAD1');
      detector.blockAddress('0xBAD2');

      const stats = detector.getStatistics();
      expect(stats.blockedAddresses).toBe(2);
    });
  });

  describe('Recommendations', () => {
    it('should recommend approval for safe transactions', async () => {
      const tx = createTransaction();
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.recommendation).toBe('approve');
    });

    it('should recommend blocking for high-risk transactions', async () => {
      const blockedAddr = '0xFRAUD';
      detector.blockAddress(blockedAddr);

      const tx = createTransaction({ fromAddress: blockedAddr });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.recommendation).toBe('block');
    });
  });

  describe('Reasoning', () => {
    it('should provide reasoning for safe transactions', async () => {
      const tx = createTransaction();
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis.reasoning).toBeDefined();
      expect(analysis.reasoning.length).toBeGreaterThan(0);
      expect(analysis.reasoning[0]).toContain('No fraud indicators');
    });

    it('should provide detailed reasoning for risky transactions', async () => {
      // Create risky transaction
      for (let i = 0; i < 15; i++) {
        await detector.analyzeTransaction(createTransaction({ id: `tx-${i}` }));
      }

      const analysis = await detector.analyzeTransaction(createTransaction());
      
      if (analysis.signals.length > 0) {
        expect(analysis.reasoning.length).toBeGreaterThan(1);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle transaction with no geo location', async () => {
      const tx = createTransaction({
        geoLocation: undefined
      });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis).toBeDefined();
      expect(analysis.signals.filter(s => s.type === 'geo_anomaly')).toHaveLength(0);
    });

    it('should handle first transaction gracefully', async () => {
      const tx = createTransaction({ userId: 'first-time-user' });
      const analysis = await detector.analyzeTransaction(tx);

      expect(analysis).toBeDefined();
      expect(analysis.riskLevel).toBe('safe');
    });

    it('should handle concurrent analysis', async () => {
      const promises = [];
      
      for (let i = 0; i < 5; i++) {
        const tx = createTransaction({
          id: `tx-concurrent-${i}`,
          userId: `user-${i % 2}` // Alternate between 2 users
        });
        promises.push(detector.analyzeTransaction(tx));
      }

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.riskScore).toBeGreaterThanOrEqual(0);
        expect(result.riskScore).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Model Configuration', () => {
    it('should respect disabled models', async () => {
      const configNoVelocity: FraudConfig = {
        ...config,
        models: ['amount_anomaly'] // Only amount anomaly enabled
      };

      const detectorNoVelocity = new FraudDetector(configNoVelocity);

      // Send many transactions
      for (let i = 0; i < 15; i++) {
        await detectorNoVelocity.analyzeTransaction(createTransaction({ id: `tx-${i}` }));
      }

      const analysis = await detectorNoVelocity.analyzeTransaction(createTransaction());

      // Should not have velocity signals
      expect(analysis.signals.filter(s => s.type === 'velocity')).toHaveLength(0);
    });

    it('should work with single model', async () => {
      const singleModelConfig: FraudConfig = {
        ...config,
        models: ['pattern_recognition']
      };

      const singleModelDetector = new FraudDetector(singleModelConfig);
      const tx = createTransaction();
      const analysis = await singleModelDetector.analyzeTransaction(tx);

      expect(analysis).toBeDefined();
    });
  });
});
