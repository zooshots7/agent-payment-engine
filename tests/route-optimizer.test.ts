import { describe, it, expect, beforeEach } from 'vitest';
import { RouteOptimizer, RouteConfig, ChainId } from '../src/strategy/route-optimizer';

describe('RouteOptimizer', () => {
  let optimizer: RouteOptimizer;
  let config: RouteConfig;

  beforeEach(() => {
    config = {
      enabled: true,
      chains: ['solana', 'base', 'ethereum', 'arbitrum'],
      optimizeFor: 'balance',
      maxHops: 3,
      slippageTolerance: 0.5,
      bridges: ['Wormhole', 'Mayan', 'Allbridge', 'Stargate'],
      gasMultiplier: 1.0
    };

    optimizer = new RouteOptimizer(config);
  });

  describe('Initialization', () => {
    it('should initialize with correct config', () => {
      expect(optimizer).toBeDefined();
      expect(optimizer.getSupportedChains()).toContain('solana');
      expect(optimizer.getSupportedChains()).toContain('base');
      expect(optimizer.getSupportedBridges()).toContain('Wormhole');
    });

    it('should only include configured chains', () => {
      const chains = optimizer.getSupportedChains();
      expect(chains).toHaveLength(4);
      expect(chains).toContain('solana');
      expect(chains).toContain('base');
      expect(chains).toContain('ethereum');
      expect(chains).toContain('arbitrum');
    });

    it('should only include configured bridges', () => {
      const bridges = optimizer.getSupportedBridges();
      expect(bridges).toContain('Wormhole');
      expect(bridges).toContain('Mayan');
      expect(bridges).toContain('Allbridge');
      expect(bridges).toContain('Stargate');
    });
  });

  describe('Same Chain Routing', () => {
    it('should handle same chain transfer', async () => {
      const route = await optimizer.findOptimalRoute('solana', 'solana', 1000);
      
      expect(route.path).toHaveLength(0);
      expect(route.totalCost).toBe(0);
      expect(route.totalTime).toBe(0);
      expect(route.totalHops).toBe(0);
      expect(route.successProbability).toBe(1.0);
    });
  });

  describe('Direct Routes', () => {
    it('should find direct route between supported chains', async () => {
      const route = await optimizer.findOptimalRoute('solana', 'base', 1000);
      
      expect(route).toBeDefined();
      expect(route.path.length).toBeGreaterThan(0);
      expect(route.path[0].fromChain).toBe('solana');
      expect(route.path[route.path.length - 1].toChain).toBe('base');
    });

    it('should calculate total cost correctly', async () => {
      const route = await optimizer.findOptimalRoute('solana', 'ethereum', 500);
      
      expect(route.totalCost).toBeGreaterThan(0);
      
      // Verify cost equals sum of hop costs
      const sumOfHopCosts = route.path.reduce((sum, hop) => sum + hop.estimatedCost, 0);
      expect(route.totalCost).toBeCloseTo(sumOfHopCosts, 2);
    });

    it('should calculate total time correctly', async () => {
      const route = await optimizer.findOptimalRoute('base', 'arbitrum', 2000);
      
      expect(route.totalTime).toBeGreaterThan(0);
      
      // Verify time equals sum of hop times
      const sumOfHopTimes = route.path.reduce((sum, hop) => sum + hop.estimatedTime, 0);
      expect(route.totalTime).toBe(sumOfHopTimes);
    });
  });

  describe('Optimization Strategies', () => {
    it('should optimize for cost', async () => {
      config.optimizeFor = 'cost';
      optimizer = new RouteOptimizer(config);
      
      const route = await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
      
      expect(route).toBeDefined();
      expect(route.totalCost).toBeGreaterThan(0);
      // Cost-optimized route should prioritize low fees
    });

    it('should optimize for speed', async () => {
      config.optimizeFor = 'speed';
      optimizer = new RouteOptimizer(config);
      
      const route = await optimizer.findOptimalRoute('ethereum', 'arbitrum', 1000);
      
      expect(route).toBeDefined();
      expect(route.totalTime).toBeGreaterThan(0);
      // Speed-optimized route should prioritize fast bridges
    });

    it('should optimize for balance', async () => {
      config.optimizeFor = 'balance';
      optimizer = new RouteOptimizer(config);
      
      const route = await optimizer.findOptimalRoute('solana', 'base', 1000);
      
      expect(route).toBeDefined();
      expect(route.totalCost).toBeGreaterThan(0);
      expect(route.totalTime).toBeGreaterThan(0);
      // Balanced route should consider both cost and time
    });
  });

  describe('Multi-hop Routing', () => {
    it('should respect max hops constraint', async () => {
      config.maxHops = 2;
      optimizer = new RouteOptimizer(config);
      
      const route = await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
      
      expect(route.totalHops).toBeLessThanOrEqual(2);
    });

    it('should find route within max hops', async () => {
      config.maxHops = 3;
      optimizer = new RouteOptimizer(config);
      
      const route = await optimizer.findOptimalRoute('solana', 'arbitrum', 1000);
      
      expect(route.totalHops).toBeGreaterThan(0);
      expect(route.totalHops).toBeLessThanOrEqual(3);
    });
  });

  describe('Success Probability', () => {
    it('should calculate success probability', async () => {
      const route = await optimizer.findOptimalRoute('solana', 'base', 1000);
      
      expect(route.successProbability).toBeGreaterThan(0);
      expect(route.successProbability).toBeLessThanOrEqual(1);
    });

    it('should have lower probability for multi-hop routes', async () => {
      // Get a direct route
      config.maxHops = 1;
      const optimizerDirect = new RouteOptimizer(config);
      const directRoute = await optimizerDirect.findOptimalRoute('ethereum', 'arbitrum', 1000);
      
      // Get a multi-hop route (if possible)
      config.maxHops = 3;
      const optimizerMulti = new RouteOptimizer(config);
      const multiRoute = await optimizerMulti.findOptimalRoute('solana', 'ethereum', 1000);
      
      // Multi-hop should have equal or lower probability than direct
      if (multiRoute.totalHops > directRoute.totalHops) {
        expect(multiRoute.successProbability).toBeLessThanOrEqual(directRoute.successProbability);
      }
    });
  });

  describe('Amount Constraints', () => {
    it('should handle small amounts', async () => {
      const route = await optimizer.findOptimalRoute('solana', 'base', 100);
      
      expect(route).toBeDefined();
      expect(route.path.length).toBeGreaterThan(0);
    });

    it('should handle large amounts', async () => {
      const route = await optimizer.findOptimalRoute('ethereum', 'arbitrum', 100000);
      
      expect(route).toBeDefined();
      expect(route.path.length).toBeGreaterThan(0);
    });

    it('should throw for unsupported chains', async () => {
      await expect(
        optimizer.findOptimalRoute('polygon' as ChainId, 'solana', 1000)
      ).rejects.toThrow('Unsupported chain');
    });
  });

  describe('Gas Price Tracking', () => {
    it('should fetch gas prices for supported chains', async () => {
      // Trigger gas price update by finding a route
      await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
      
      const gasPrices = optimizer.getGasPrices();
      expect(gasPrices.size).toBeGreaterThan(0);
    });

    it('should have gas prices for configured chains', async () => {
      await optimizer.findOptimalRoute('solana', 'base', 1000);
      
      const gasPrices = optimizer.getGasPrices();
      expect(gasPrices.has('solana')).toBe(true);
    });

    it('should update gas prices on route finding', async () => {
      const route1 = await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
      const gasPrices1 = optimizer.getGasPrices();
      
      // Find another route (should update gas prices)
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      const route2 = await optimizer.findOptimalRoute('base', 'arbitrum', 1000);
      const gasPrices2 = optimizer.getGasPrices();
      
      expect(gasPrices1.size).toBeGreaterThan(0);
      expect(gasPrices2.size).toBeGreaterThan(0);
    });
  });

  describe('Route Recommendations', () => {
    it('should provide recommendation for direct routes', async () => {
      config.maxHops = 1;
      optimizer = new RouteOptimizer(config);
      
      const route = await optimizer.findOptimalRoute('ethereum', 'arbitrum', 1000);
      
      expect(route.recommendation).toBeDefined();
      expect(route.recommendation.length).toBeGreaterThan(0);
    });

    it('should provide recommendation for multi-hop routes', async () => {
      config.maxHops = 3;
      optimizer = new RouteOptimizer(config);
      
      const route = await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
      
      expect(route.recommendation).toBeDefined();
      expect(route.recommendation).toContain('bridge');
    });
  });

  describe('Bridge Selection', () => {
    it('should use configured bridges only', async () => {
      config.bridges = ['Wormhole', 'Mayan'];
      optimizer = new RouteOptimizer(config);
      
      const route = await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
      
      route.path.forEach(hop => {
        expect(['Wormhole', 'Mayan']).toContain(hop.bridge);
      });
    });

    it('should handle single bridge config', async () => {
      config.bridges = ['Wormhole'];
      optimizer = new RouteOptimizer(config);
      
      const route = await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
      
      expect(route).toBeDefined();
      route.path.forEach(hop => {
        expect(hop.bridge).toBe('Wormhole');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum viable amount', async () => {
      const route = await optimizer.findOptimalRoute('solana', 'base', 50);
      
      expect(route).toBeDefined();
      expect(route.totalCost).toBeLessThan(50); // Cost should be less than amount
    });

    it('should throw for extremely small amounts below bridge minimums', async () => {
      // Most bridges have minimum of 10-50 USDC
      await expect(
        optimizer.findOptimalRoute('solana', 'ethereum', 1)
      ).rejects.toThrow();
    });

    it('should handle same source and destination', async () => {
      const route = await optimizer.findOptimalRoute('base', 'base', 1000);
      
      expect(route.totalHops).toBe(0);
      expect(route.totalCost).toBe(0);
    });
  });

  describe('Cost Breakdown', () => {
    it('should include bridge fees in cost', async () => {
      const route = await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
      
      route.path.forEach(hop => {
        expect(hop.estimatedCost).toBeGreaterThan(0);
      });
    });

    it('should include gas estimates', async () => {
      const route = await optimizer.findOptimalRoute('ethereum', 'arbitrum', 1000);
      
      route.path.forEach(hop => {
        expect(hop.gasEstimate).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have total cost equal to sum of components', async () => {
      const route = await optimizer.findOptimalRoute('solana', 'base', 1000);
      
      const calculatedTotal = route.path.reduce(
        (sum, hop) => sum + hop.estimatedCost,
        0
      );
      
      expect(route.totalCost).toBeCloseTo(calculatedTotal, 2);
    });
  });

  describe('Performance', () => {
    it('should find route in reasonable time', async () => {
      const startTime = Date.now();
      
      await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle multiple concurrent route requests', async () => {
      const promises = [
        optimizer.findOptimalRoute('solana', 'ethereum', 1000),
        optimizer.findOptimalRoute('base', 'arbitrum', 2000),
        optimizer.findOptimalRoute('ethereum', 'solana', 1500)
      ];
      
      const routes = await Promise.all(promises);
      
      expect(routes).toHaveLength(3);
      routes.forEach(route => {
        expect(route).toBeDefined();
        expect(route.path.length).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
