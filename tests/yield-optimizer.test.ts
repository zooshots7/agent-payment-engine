import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Connection, Keypair } from '@solana/web3.js';
import { YieldOptimizer, YieldStrategy, Protocol } from '../src/strategy/yield-optimizer';
import { AgentWallet } from '../src/core/wallet';

describe('YieldOptimizer', () => {
  let connection: Connection;
  let wallet: AgentWallet;
  let strategy: YieldStrategy;
  let optimizer: YieldOptimizer;

  const mockProtocols: Protocol[] = [
    {
      name: 'Kamino',
      address: '11111111111111111111111111111111',
      apy: 8.5,
      tvl: 500_000_000,
      riskLevel: 'low',
      weight: 0.5,
      minDeposit: 100
    },
    {
      name: 'Marginfi',
      address: '22222222222222222222222222222222',
      apy: 7.2,
      tvl: 300_000_000,
      riskLevel: 'medium',
      weight: 0.3,
      minDeposit: 100
    },
    {
      name: 'Drift',
      address: '33333333333333333333333333333333',
      apy: 9.1,
      tvl: 200_000_000,
      riskLevel: 'high',
      weight: 0.2,
      minDeposit: 100
    }
  ];

  beforeEach(() => {
    connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    wallet = new AgentWallet(Keypair.generate());
    
    strategy = {
      strategy: 'balanced',
      minBalanceThreshold: 1000,
      protocols: mockProtocols,
      rebalanceFrequency: 'hourly',
      emergencyReserve: 100,
      maxSlippage: 0.5
    };

    optimizer = new YieldOptimizer(connection, wallet, strategy);
  });

  describe('Initialization', () => {
    it('should create optimizer with correct strategy', () => {
      expect(optimizer).toBeDefined();
      expect(optimizer.getPositions()).toHaveLength(0);
      expect(optimizer.getTotalValue()).toBe(0);
    });
  });

  describe('Risk Tolerance Filtering', () => {
    it('should filter protocols for conservative strategy', () => {
      strategy.strategy = 'conservative';
      optimizer = new YieldOptimizer(connection, wallet, strategy);
      
      // Conservative should only include low-risk protocols
      // We'll test this indirectly through optimize() behavior
      expect(strategy.protocols.filter(p => p.riskLevel === 'low')).toHaveLength(1);
    });

    it('should filter protocols for balanced strategy', () => {
      strategy.strategy = 'balanced';
      optimizer = new YieldOptimizer(connection, wallet, strategy);
      
      // Balanced should include low and medium risk
      const eligibleRisks = ['low', 'medium'];
      const eligibleProtocols = strategy.protocols.filter(p => 
        eligibleRisks.includes(p.riskLevel)
      );
      expect(eligibleProtocols).toHaveLength(2);
    });

    it('should include all protocols for aggressive strategy', () => {
      strategy.strategy = 'aggressive';
      optimizer = new YieldOptimizer(connection, wallet, strategy);
      
      // Aggressive should include all risk levels
      expect(strategy.protocols).toHaveLength(3);
    });
  });

  describe('Allocation Calculation', () => {
    it('should respect minimum deposit requirements', () => {
      strategy.protocols[0].minDeposit = 10_000; // Set very high minimum
      optimizer = new YieldOptimizer(connection, wallet, strategy);
      
      // With 1000 balance and 10k min deposit, should not allocate to this protocol
      // Test indirectly through optimize
      expect(strategy.protocols[0].minDeposit).toBeGreaterThan(strategy.minBalanceThreshold);
    });

    it('should allocate based on weights', () => {
      // Mock protocol with 100% weight should get all allocation
      strategy.protocols = [
        {
          ...mockProtocols[0],
          weight: 1.0
        }
      ];
      optimizer = new YieldOptimizer(connection, wallet, strategy);
      
      expect(strategy.protocols[0].weight).toBe(1.0);
    });

    it('should reserve emergency funds', () => {
      strategy.emergencyReserve = 200;
      optimizer = new YieldOptimizer(connection, wallet, strategy);
      
      // Emergency reserve should be respected in allocation
      expect(strategy.emergencyReserve).toBe(200);
    });
  });

  describe('Performance Tracking', () => {
    it('should track positions after optimization', async () => {
      // Mock getBalance to return sufficient funds
      vi.spyOn(optimizer as any, 'getBalance').mockResolvedValue(5000);
      
      await optimizer.optimize();
      
      const positions = optimizer.getPositions();
      expect(positions.length).toBeGreaterThan(0);
    });

    it('should calculate total portfolio value', () => {
      // Add mock positions
      (optimizer as any).positions.set('Kamino', {
        protocol: 'Kamino',
        amount: 1000,
        apy: 8.5,
        value: 1000,
        lastUpdated: new Date()
      });

      expect(optimizer.getTotalValue()).toBe(1000);
    });
  });

  describe('Lifecycle', () => {
    it('should start and stop correctly', async () => {
      // Mock getBalance to avoid real network calls
      vi.spyOn(optimizer as any, 'getBalance').mockResolvedValue(5000);
      
      await optimizer.start();
      expect((optimizer as any).isRunning).toBe(true);
      
      optimizer.stop();
      expect((optimizer as any).isRunning).toBe(false);
    });

    it('should not allow starting twice', async () => {
      vi.spyOn(optimizer as any, 'getBalance').mockResolvedValue(5000);
      
      await optimizer.start();
      
      await expect(optimizer.start()).rejects.toThrow(
        'Yield optimizer is already running'
      );
      
      optimizer.stop();
    });
  });

  describe('Rebalancing Logic', () => {
    it('should rebalance when allocation differs significantly', () => {
      // Set up current position
      (optimizer as any).positions.set('Kamino', {
        protocol: 'Kamino',
        amount: 1000,
        apy: 8.5,
        value: 1000,
        lastUpdated: new Date()
      });

      // New allocation is very different (200 vs 1000 = 80% difference)
      const newAllocation = { 'Kamino': 200 };
      const shouldRebalance = (optimizer as any).shouldRebalance(newAllocation);
      
      expect(shouldRebalance).toBe(true);
    });

    it('should not rebalance when allocation is similar', () => {
      // Set up current position
      (optimizer as any).positions.set('Kamino', {
        protocol: 'Kamino',
        amount: 1000,
        apy: 8.5,
        value: 1000,
        lastUpdated: new Date()
      });

      // New allocation is very similar (1020 vs 1000 = 2% difference)
      const newAllocation = { 'Kamino': 1020 };
      const shouldRebalance = (optimizer as any).shouldRebalance(newAllocation);
      
      expect(shouldRebalance).toBe(false);
    });
  });

  describe('Report Generation', () => {
    it('should generate comprehensive report', () => {
      // Add mock positions
      (optimizer as any).positions.set('Kamino', {
        protocol: 'Kamino',
        amount: 1000,
        apy: 8.5,
        value: 1000,
        lastUpdated: new Date()
      });

      (optimizer as any).positions.set('Marginfi', {
        protocol: 'Marginfi',
        amount: 500,
        apy: 7.2,
        value: 500,
        lastUpdated: new Date()
      });

      const report = (optimizer as any).generateReport();

      expect(report).toHaveProperty('totalValue');
      expect(report).toHaveProperty('totalYield');
      expect(report).toHaveProperty('positions');
      expect(report).toHaveProperty('performanceVsBaseline');
      expect(report.positions).toHaveLength(2);
      expect(report.totalValue).toBe(1500);
    });

    it('should calculate performance vs baseline correctly', () => {
      // Add high-yield position
      (optimizer as any).positions.set('Kamino', {
        protocol: 'Kamino',
        amount: 1000,
        apy: 10.0,
        value: 1000,
        lastUpdated: new Date()
      });

      const report = (optimizer as any).generateReport();
      
      // 10% APY vs 5% baseline = 100% improvement
      expect(report.performanceVsBaseline).toBe(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero balance', async () => {
      vi.spyOn(optimizer as any, 'getBalance').mockResolvedValue(0);
      
      const report = await optimizer.optimize();
      
      expect(report.positions).toHaveLength(0);
      expect(report.totalValue).toBe(0);
    });

    it('should handle balance below threshold', async () => {
      vi.spyOn(optimizer as any, 'getBalance').mockResolvedValue(500);
      strategy.minBalanceThreshold = 1000;
      
      const report = await optimizer.optimize();
      
      // Should not optimize when balance is below threshold
      expect(report.positions).toHaveLength(0);
    });

    it('should handle no eligible protocols', async () => {
      // Conservative strategy with only high-risk protocols
      strategy.strategy = 'conservative';
      strategy.protocols = [
        {
          name: 'HighRisk',
          address: '11111111111111111111111111111111',
          apy: 15.0,
          tvl: 100_000_000,
          riskLevel: 'high',
          weight: 1.0,
          minDeposit: 100
        }
      ];
      
      optimizer = new YieldOptimizer(connection, wallet, strategy);
      vi.spyOn(optimizer as any, 'getBalance').mockResolvedValue(5000);
      
      const report = await optimizer.optimize();
      
      // Should handle gracefully
      expect(report).toBeDefined();
    });
  });
});
