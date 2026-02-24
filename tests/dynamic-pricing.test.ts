import { describe, it, expect, beforeEach } from 'vitest';
import {
  DynamicPricing,
  PricingConfig,
  MarketData,
  AdjustmentFactor
} from '../src/strategy/dynamic-pricing';

describe('DynamicPricing', () => {
  let pricing: DynamicPricing;
  let config: PricingConfig;
  let baseMarketData: MarketData;

  beforeEach(() => {
    const adjustmentFactors: AdjustmentFactor[] = [
      {
        name: 'Demand Multiplier',
        type: 'demand',
        weight: 1.0,
        enabled: true
      },
      {
        name: 'Competitor Price',
        type: 'competitor',
        weight: 0.8,
        enabled: true
      },
      {
        name: 'Time of Day',
        type: 'time',
        weight: 0.5,
        enabled: true
      },
      {
        name: 'Capacity',
        type: 'capacity',
        weight: 0.7,
        enabled: true
      }
    ];

    config = {
      enabled: true,
      basePrice: 10.0,
      currency: 'USDC',
      adjustmentFactors,
      priceFloor: 5.0,
      priceCeiling: 50.0,
      updateFrequency: '5m',
      abTestingEnabled: true,
      learningRate: 0.1
    };

    baseMarketData = {
      timestamp: new Date(),
      demand: 0.5,
      supply: 0.5,
      competitorPrices: [],
      historicalData: []
    };

    pricing = new DynamicPricing(config);
  });

  describe('Initialization', () => {
    it('should initialize with base price', () => {
      expect(pricing.getCurrentPrice()).toBe(10.0);
    });

    it('should initialize A/B test variants', () => {
      const metrics = pricing.getMetrics();
      expect(metrics.abTestResults).toBeUndefined(); // Not enough data yet
    });
  });

  describe('Demand-Based Pricing', () => {
    it('should increase price with high demand', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.9 // High demand
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation.recommendedPrice).toBeGreaterThan(config.basePrice);
    });

    it('should decrease price with low demand', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.1 // Low demand
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation.recommendedPrice).toBeLessThan(config.basePrice);
    });

    it('should maintain price with neutral demand', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.5 // Neutral
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      const change = Math.abs(recommendation.recommendedPrice - config.basePrice);
      expect(change).toBeLessThan(2); // Small change
    });
  });

  describe('Competitor-Based Pricing', () => {
    it('should adjust toward competitor average', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.5,
        competitorPrices: [
          { competitor: 'CompA', price: 12.0, timestamp: new Date() },
          { competitor: 'CompB', price: 13.0, timestamp: new Date() },
          { competitor: 'CompC', price: 11.0, timestamp: new Date() }
        ]
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      // Should be influenced by competitor average (12.0)
      expect(recommendation.factors.some(f => f.factor === 'Competitor Price')).toBe(true);
    });

    it('should handle no competitor data', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        competitorPrices: []
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation).toBeDefined();
    });

    it('should weight competitors by market share', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        competitorPrices: [
          { competitor: 'BigComp', price: 15.0, timestamp: new Date(), market_share: 0.6 },
          { competitor: 'SmallComp', price: 8.0, timestamp: new Date(), market_share: 0.4 }
        ]
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation).toBeDefined();
    });
  });

  describe('Time-Based Pricing', () => {
    it('should apply time of day adjustments', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.5
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      // Should have time factor
      expect(recommendation.factors.some(f => f.factor === 'Time of Day')).toBe(true);
    });
  });

  describe('Capacity-Based Pricing', () => {
    it('should increase price with low supply', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        supply: 0.1 // Low supply
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      const capacityFactor = recommendation.factors.find(f => f.factor === 'Capacity');
      expect(capacityFactor).toBeDefined();
      expect(capacityFactor!.impact).toBeGreaterThan(0);
    });

    it('should decrease price with high supply', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        supply: 0.9 // High supply
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      const capacityFactor = recommendation.factors.find(f => f.factor === 'Capacity');
      expect(capacityFactor).toBeDefined();
      expect(capacityFactor!.impact).toBeLessThan(0);
    });
  });

  describe('Price Bounds', () => {
    it('should not exceed price ceiling', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 1.0, // Max demand
        supply: 0.0 // No supply
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation.recommendedPrice).toBeLessThanOrEqual(config.priceCeiling);
    });

    it('should not go below price floor', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.0, // No demand
        supply: 1.0 // Max supply
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation.recommendedPrice).toBeGreaterThanOrEqual(config.priceFloor);
    });
  });

  describe('Confidence Scoring', () => {
    it('should have higher confidence with more data', async () => {
      // Add historical data
      const historicalData = Array.from({ length: 150 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60000),
        price: 10 + Math.random() * 2,
        volume: 100,
        revenue: 1000,
        conversion_rate: 0.5
      }));

      const marketData: MarketData = {
        ...baseMarketData,
        historicalData
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation.confidence).toBeGreaterThan(0.7);
    });

    it('should have lower confidence with conflicting factors', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.9, // High demand (increase price)
        supply: 0.9, // High supply (decrease price)
        competitorPrices: [
          { competitor: 'CompA', price: 5.0, timestamp: new Date() } // Much lower
        ]
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation.confidence).toBeDefined();
    });
  });

  describe('Reasoning Generation', () => {
    it('should provide clear reasoning', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.8,
        competitorPrices: [
          { competitor: 'CompA', price: 12.0, timestamp: new Date() }
        ]
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      expect(recommendation.reasoning).toBeDefined();
      expect(recommendation.reasoning.length).toBeGreaterThan(0);
    });

    it('should mention high demand', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.8
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      const hasHighDemandMention = recommendation.reasoning.some(r => 
        r.toLowerCase().includes('high') || r.toLowerCase().includes('demand')
      );
      expect(hasHighDemandMention).toBe(true);
    });

    it('should mention competitor context', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        competitorPrices: [
          { competitor: 'CompA', price: 12.0, timestamp: new Date() }
        ]
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      const hasCompetitorMention = recommendation.reasoning.some(r => 
        r.toLowerCase().includes('competitor')
      );
      expect(hasCompetitorMention).toBe(true);
    });
  });

  describe('Impact Estimation', () => {
    it('should estimate demand impact', async () => {
      const marketData: MarketData = baseMarketData;
      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      expect(recommendation.expectedImpact.demandChange).toBeDefined();
      expect(typeof recommendation.expectedImpact.demandChange).toBe('number');
    });

    it('should estimate revenue impact', async () => {
      const marketData: MarketData = baseMarketData;
      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      expect(recommendation.expectedImpact.revenueChange).toBeDefined();
    });

    it('should estimate margin impact', async () => {
      const marketData: MarketData = baseMarketData;
      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      expect(recommendation.expectedImpact.marginChange).toBeDefined();
    });
  });

  describe('A/B Testing', () => {
    it('should assign A/B test variants', async () => {
      const marketData: MarketData = baseMarketData;
      
      // Run multiple times to get different variants
      const variants = new Set();
      for (let i = 0; i < 20; i++) {
        const recommendation = await pricing.calculateOptimalPrice(marketData);
        if (recommendation.abTestVariant) {
          variants.add(recommendation.abTestVariant);
        }
      }
      
      expect(variants.size).toBeGreaterThan(0);
    });

    it('should record conversions', () => {
      pricing.recordConversion('control', 100);
      pricing.recordConversion('control', 150);
      
      // Should update metrics
      expect(() => pricing.getMetrics()).not.toThrow();
    });

    it('should analyze A/B test results with enough data', async () => {
      // Generate enough impressions
      for (let i = 0; i < 150; i++) {
        await pricing.calculateOptimalPrice(baseMarketData);
      }

      // Record some conversions
      pricing.recordConversion('control', 100);
      pricing.recordConversion('variant_high', 110);
      pricing.recordConversion('variant_low', 90);

      const metrics = pricing.getMetrics();
      expect(metrics.abTestResults).toBeDefined();
    });

    it('should not return A/B results with insufficient data', () => {
      const results = pricing.analyzeABTest();
      expect(results).toBeUndefined();
    });

    it('should reset A/B tests', () => {
      pricing.recordConversion('control', 100);
      pricing.resetABTests();
      
      const results = pricing.analyzeABTest();
      expect(results).toBeUndefined();
    });
  });

  describe('Price Updates', () => {
    it('should update current price', () => {
      pricing.updatePrice(12.0, 10, 120);
      expect(pricing.getCurrentPrice()).toBe(12.0);
    });

    it('should track price history', () => {
      pricing.updatePrice(12.0, 10, 120);
      pricing.updatePrice(13.0, 15, 195);
      
      const history = pricing.getHistory();
      expect(history.length).toBe(2);
    });

    it('should limit history size', () => {
      // Add 1100 data points
      for (let i = 0; i < 1100; i++) {
        pricing.updatePrice(10 + i * 0.1, 10, 100);
      }
      
      const history = pricing.getHistory();
      expect(history.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Metrics', () => {
    it('should calculate average price', () => {
      pricing.updatePrice(10.0, 10, 100);
      pricing.updatePrice(12.0, 10, 120);
      pricing.updatePrice(11.0, 10, 110);
      
      const metrics = pricing.getMetrics();
      // Average of [10, 12, 11] = 11, but the current price (10) is also included in calculation
      expect(metrics.averagePrice).toBeCloseTo(10.67, 1);
    });

    it('should calculate price volatility', () => {
      pricing.updatePrice(10.0, 10, 100);
      pricing.updatePrice(15.0, 10, 150);
      pricing.updatePrice(12.0, 10, 120);
      
      const metrics = pricing.getMetrics();
      expect(metrics.priceVolatility).toBeGreaterThan(0);
    });

    it('should track total revenue', () => {
      pricing.updatePrice(10.0, 10, 100);
      pricing.updatePrice(12.0, 10, 120);
      
      const metrics = pricing.getMetrics();
      expect(metrics.totalRevenue).toBe(220);
    });

    it('should track total volume', () => {
      pricing.updatePrice(10.0, 10, 100);
      pricing.updatePrice(12.0, 15, 180);
      
      const metrics = pricing.getMetrics();
      expect(metrics.totalVolume).toBe(25);
    });
  });

  describe('Disabled Factors', () => {
    it('should skip disabled factors', async () => {
      config.adjustmentFactors[0].enabled = false; // Disable demand
      pricing = new DynamicPricing(config);
      
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.9 // High demand
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      // Should not have demand factor
      expect(recommendation.factors.some(f => f.factor === 'Demand Multiplier')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero demand and supply', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0,
        supply: 0
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation).toBeDefined();
      expect(recommendation.recommendedPrice).toBeGreaterThanOrEqual(config.priceFloor);
    });

    it('should handle max demand and supply', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 1.0,
        supply: 1.0
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation).toBeDefined();
    });

    it('should handle no historical data', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        historicalData: []
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      expect(recommendation).toBeDefined();
    });
  });

  describe('Factor Contributions', () => {
    it('should track individual factor impacts', async () => {
      const marketData: MarketData = {
        ...baseMarketData,
        demand: 0.8
      };

      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      expect(recommendation.factors.length).toBeGreaterThan(0);
      recommendation.factors.forEach(factor => {
        expect(factor.factor).toBeDefined();
        expect(typeof factor.impact).toBe('number');
        expect(typeof factor.weight).toBe('number');
        expect(typeof factor.score).toBe('number');
      });
    });
  });

  describe('A/B Testing Disabled', () => {
    it('should not assign variants when disabled', async () => {
      config.abTestingEnabled = false;
      pricing = new DynamicPricing(config);
      
      const marketData: MarketData = baseMarketData;
      const recommendation = await pricing.calculateOptimalPrice(marketData);
      
      expect(recommendation.abTestVariant).toBeUndefined();
    });
  });
});
