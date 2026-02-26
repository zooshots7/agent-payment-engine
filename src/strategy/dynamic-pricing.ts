/**
 * Dynamic Pricing AI
 * 
 * AI-driven pricing engine that adjusts prices based on:
 * - Market demand (real-time)
 * - Competitor pricing
 * - Supply/capacity
 * - Time of day patterns
 * - Historical performance
 * - A/B testing results
 */

export interface PricingConfig {
  enabled: boolean;
  basePrice: number;
  currency: string;
  adjustmentFactors: AdjustmentFactor[];
  priceFloor: number;
  priceCeiling: number;
  updateFrequency: 'realtime' | '1m' | '5m' | '15m' | '1h';
  abTestingEnabled: boolean;
  learningRate: number;
}

export interface AdjustmentFactor {
  name: string;
  type: 'demand' | 'competitor' | 'time' | 'capacity' | 'custom';
  weight: number;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface MarketData {
  timestamp: Date;
  demand: number; // 0-1 (0 = no demand, 1 = max demand)
  supply: number; // 0-1 (0 = no capacity, 1 = full capacity)
  competitorPrices: CompetitorPrice[];
  historicalData: HistoricalDataPoint[];
}

export interface CompetitorPrice {
  competitor: string;
  price: number;
  timestamp: Date;
  market_share?: number;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  price: number;
  volume: number;
  revenue: number;
  conversion_rate: number;
}

export interface PriceRecommendation {
  recommendedPrice: number;
  priceChange: number;
  priceChangePercent: number;
  confidence: number;
  reasoning: string[];
  factors: FactorContribution[];
  expectedImpact: {
    demandChange: number;
    revenueChange: number;
    marginChange: number;
  };
  abTestVariant?: string;
}

export interface FactorContribution {
  factor: string;
  impact: number; // Price change attributed to this factor
  weight: number;
  score: number;
}

export interface ABTestVariant {
  id: string;
  name: string;
  priceMultiplier: number;
  allocation: number; // Percentage of traffic
  conversions: number;
  revenue: number;
  impressions: number;
}

export interface PricingMetrics {
  currentPrice: number;
  averagePrice: number;
  priceVolatility: number;
  totalRevenue: number;
  totalVolume: number;
  averageConversionRate: number;
  abTestResults?: ABTestResults;
}

export interface ABTestResults {
  variants: ABTestVariant[];
  winner?: string;
  confidence: number;
  startDate: Date;
  sampleSize: number;
}

export class DynamicPricing {
  private config: PricingConfig;
  private currentPrice: number;
  private priceHistory: HistoricalDataPoint[] = [];
  private abTestVariants: Map<string, ABTestVariant> = new Map();
  private modelWeights: Map<string, number> = new Map();
  private lastUpdate: Date = new Date();

  constructor(config: PricingConfig) {
    this.config = config;
    this.currentPrice = config.basePrice;
    this.initializeModelWeights();
    this.initializeABTests();
  }

  /**
   * Initialize ML model weights
   */
  private initializeModelWeights(): void {
    this.config.adjustmentFactors.forEach(factor => {
      if (factor.enabled) {
        this.modelWeights.set(factor.name, factor.weight);
      }
    });
  }

  /**
   * Initialize A/B test variants
   */
  private initializeABTests(): void {
    if (!this.config.abTestingEnabled) return;

    // Create default variants
    const variants: ABTestVariant[] = [
      {
        id: 'control',
        name: 'Control (Base Price)',
        priceMultiplier: 1.0,
        allocation: 0.4,
        conversions: 0,
        revenue: 0,
        impressions: 0
      },
      {
        id: 'variant_high',
        name: '+10% Higher',
        priceMultiplier: 1.1,
        allocation: 0.3,
        conversions: 0,
        revenue: 0,
        impressions: 0
      },
      {
        id: 'variant_low',
        name: '-10% Lower',
        priceMultiplier: 0.9,
        allocation: 0.3,
        conversions: 0,
        revenue: 0,
        impressions: 0
      }
    ];

    variants.forEach(v => this.abTestVariants.set(v.id, v));
  }

  /**
   * Calculate optimal price based on market conditions
   */
  async calculateOptimalPrice(marketData: MarketData): Promise<PriceRecommendation> {
    console.log('💰 Calculating optimal price...');

    let adjustedPrice = this.config.basePrice;
    const factors: FactorContribution[] = [];

    // Apply each enabled adjustment factor
    for (const factor of this.config.adjustmentFactors) {
      if (!factor.enabled) continue;

      const contribution = await this.applyFactor(factor, marketData, adjustedPrice);
      factors.push(contribution);
      adjustedPrice += contribution.impact;
    }

    // Enforce price bounds
    adjustedPrice = Math.max(this.config.priceFloor, Math.min(this.config.priceCeiling, adjustedPrice));

    // Calculate price change
    const priceChange = adjustedPrice - this.currentPrice;
    const priceChangePercent = (priceChange / this.currentPrice) * 100;

    // Calculate confidence
    const confidence = this.calculateConfidence(factors, marketData);

    // Generate reasoning
    const reasoning = this.generateReasoning(factors, marketData, adjustedPrice);

    // Estimate impact
    const expectedImpact = this.estimateImpact(priceChange, marketData);

    // Select A/B test variant if enabled
    const abTestVariant = this.config.abTestingEnabled 
      ? this.selectABTestVariant()
      : undefined;

    // Apply A/B test multiplier if applicable
    if (abTestVariant) {
      const variant = this.abTestVariants.get(abTestVariant);
      if (variant) {
        adjustedPrice *= variant.priceMultiplier;
      }
    }

    const recommendation: PriceRecommendation = {
      recommendedPrice: adjustedPrice,
      priceChange,
      priceChangePercent,
      confidence,
      reasoning,
      factors,
      expectedImpact,
      abTestVariant
    };

    console.log(`✅ Optimal price: ${adjustedPrice.toFixed(2)} ${this.config.currency}`);
    console.log(`   Change: ${priceChange >= 0 ? '+' : ''}${priceChangePercent.toFixed(1)}%`);

    return recommendation;
  }

  /**
   * Apply individual pricing factor
   */
  private async applyFactor(
    factor: AdjustmentFactor,
    marketData: MarketData,
    currentPrice: number
  ): Promise<FactorContribution> {
    let impact = 0;
    let score = 0;

    switch (factor.type) {
      case 'demand':
        ({ impact, score } = this.applyDemandFactor(marketData, currentPrice, factor));
        break;

      case 'competitor':
        ({ impact, score } = this.applyCompetitorFactor(marketData, currentPrice, factor));
        break;

      case 'time':
        ({ impact, score } = this.applyTimeFactor(currentPrice, factor));
        break;

      case 'capacity':
        ({ impact, score } = this.applyCapacityFactor(marketData, currentPrice, factor));
        break;

      case 'custom':
        ({ impact, score } = this.applyCustomFactor(marketData, currentPrice, factor));
        break;
    }

    return {
      factor: factor.name,
      impact,
      weight: factor.weight,
      score
    };
  }

  /**
   * Apply demand-based pricing
   */
  private applyDemandFactor(
    marketData: MarketData,
    currentPrice: number,
    factor: AdjustmentFactor
  ): { impact: number; score: number } {
    const demand = marketData.demand;
    
    // High demand = higher price, low demand = lower price
    // Score ranges from -1 (no demand) to +1 (max demand)
    const score = (demand - 0.5) * 2;
    
    // Impact: score * weight * base price
    const impact = score * factor.weight * currentPrice * 0.1;

    return { impact, score };
  }

  /**
   * Apply competitor-based pricing
   */
  private applyCompetitorFactor(
    marketData: MarketData,
    currentPrice: number,
    factor: AdjustmentFactor
  ): { impact: number; score: number } {
    if (marketData.competitorPrices.length === 0) {
      return { impact: 0, score: 0 };
    }

    // Calculate weighted average competitor price
    const avgCompetitorPrice = marketData.competitorPrices.reduce((sum, c) => {
      const weight = c.market_share || 1;
      return sum + (c.price * weight);
    }, 0) / marketData.competitorPrices.reduce((sum, c) => sum + (c.market_share || 1), 0);

    // Score: how much below/above competitors we are
    const priceDiff = currentPrice - avgCompetitorPrice;
    const score = -priceDiff / avgCompetitorPrice; // Negative if we're cheaper

    // Impact: adjust toward competitive range
    const targetPrice = avgCompetitorPrice * 0.95; // Target 5% below average
    const impact = (targetPrice - currentPrice) * factor.weight * 0.5;

    return { impact, score };
  }

  /**
   * Apply time-based pricing (time of day, day of week)
   */
  private applyTimeFactor(
    currentPrice: number,
    factor: AdjustmentFactor
  ): { impact: number; score: number } {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // Peak hours: 9-11am, 2-4pm (business hours)
    const isPeakHour = (hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16);
    
    // Weekday vs weekend
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    let score = 0;
    
    if (isPeakHour && isWeekday) {
      score = 0.5; // Peak time - increase price
    } else if (!isWeekday) {
      score = -0.3; // Weekend - decrease price
    } else if (hour < 6 || hour > 22) {
      score = -0.5; // Off-hours - significant decrease
    }

    const impact = score * factor.weight * currentPrice * 0.1;

    return { impact, score };
  }

  /**
   * Apply capacity-based pricing
   */
  private applyCapacityFactor(
    marketData: MarketData,
    currentPrice: number,
    factor: AdjustmentFactor
  ): { impact: number; score: number } {
    const supply = marketData.supply;

    // Low supply = higher price, high supply = lower price
    const score = (0.5 - supply) * 2;

    const impact = score * factor.weight * currentPrice * 0.15;

    return { impact, score };
  }

  /**
   * Apply custom factor
   */
  private applyCustomFactor(
    _marketData: MarketData,
    _currentPrice: number,
    _factor: AdjustmentFactor
  ): { impact: number; score: number } {
    // Placeholder for custom logic
    // In production, this would execute custom pricing rules
    return { impact: 0, score: 0 };
  }

  /**
   * Calculate confidence in price recommendation
   */
  private calculateConfidence(
    factors: FactorContribution[],
    marketData: MarketData
  ): number {
    // Base confidence
    let confidence = 0.7;

    // Increase confidence with more data
    if (marketData.historicalData.length > 100) {
      confidence += 0.1;
    }

    // Increase confidence with more competitor data
    if (marketData.competitorPrices.length >= 3) {
      confidence += 0.1;
    }

    // Decrease confidence if factors disagree
    const factorScores = factors.map(f => f.score);
    const variance = this.calculateVariance(factorScores);
    if (variance > 0.5) {
      confidence -= 0.15;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate human-readable reasoning
   */
  private generateReasoning(
    factors: FactorContribution[],
    marketData: MarketData,
    recommendedPrice: number
  ): string[] {
    const reasoning: string[] = [];

    // Sort factors by absolute impact
    const sortedFactors = [...factors].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    sortedFactors.forEach(factor => {
      if (Math.abs(factor.impact) < 0.01) return;

      const direction = factor.impact > 0 ? 'increase' : 'decrease';
      const amount = Math.abs(factor.impact).toFixed(2);
      
      reasoning.push(`${factor.factor}: ${direction} price by ${amount} ${this.config.currency} (score: ${factor.score.toFixed(2)})`);
    });

    // Add market context
    if (marketData.demand > 0.7) {
      reasoning.push('High demand detected - premium pricing opportunity');
    } else if (marketData.demand < 0.3) {
      reasoning.push('Low demand - competitive pricing recommended');
    }

    // Add competitor context
    if (marketData.competitorPrices.length > 0) {
      const avgCompPrice = marketData.competitorPrices.reduce((sum, c) => sum + c.price, 0) / marketData.competitorPrices.length;
      const vs = recommendedPrice > avgCompPrice ? 'above' : 'below';
      const diff = Math.abs(((recommendedPrice - avgCompPrice) / avgCompPrice) * 100).toFixed(1);
      reasoning.push(`Recommended price is ${diff}% ${vs} competitor average`);
    }

    return reasoning;
  }

  /**
   * Estimate impact of price change
   */
  private estimateImpact(
    priceChange: number,
    _marketData: MarketData
  ): { demandChange: number; revenueChange: number; marginChange: number } {
    // Price elasticity estimate (default: -1.5, meaning 1% price increase = 1.5% demand decrease)
    const elasticity = -1.5;

    const priceChangePercent = priceChange / this.currentPrice;
    const demandChange = elasticity * priceChangePercent;

    // Revenue change = (1 + price change %) * (1 + demand change %) - 1
    const revenueChange = (1 + priceChangePercent) * (1 + demandChange) - 1;

    // Margin change (assuming 30% margin)
    const marginChange = priceChangePercent * 0.3;

    return {
      demandChange: demandChange * 100, // Convert to percentage
      revenueChange: revenueChange * 100,
      marginChange: marginChange * 100
    };
  }

  /**
   * Select A/B test variant
   */
  private selectABTestVariant(): string | undefined {
    if (!this.config.abTestingEnabled) return undefined;

    // Weighted random selection
    const rand = Math.random();
    let cumulative = 0;

    for (const [id, variant] of this.abTestVariants) {
      cumulative += variant.allocation;
      if (rand <= cumulative) {
        variant.impressions++;
        return id;
      }
    }

    return 'control';
  }

  /**
   * Record A/B test conversion
   */
  recordConversion(variantId: string, revenue: number): void {
    const variant = this.abTestVariants.get(variantId);
    if (variant) {
      variant.conversions++;
      variant.revenue += revenue;
    }
  }

  /**
   * Analyze A/B test results
   */
  analyzeABTest(): ABTestResults | undefined {
    if (!this.config.abTestingEnabled) return undefined;

    const variants = Array.from(this.abTestVariants.values());
    const totalImpressions = variants.reduce((sum, v) => sum + v.impressions, 0);

    if (totalImpressions < 100) {
      return undefined; // Not enough data
    }

    // Calculate conversion rates
    variants.forEach(v => {
      v.impressions = v.impressions || 1; // Avoid division by zero
    });

    // Find winner (highest revenue per impression)
    const revenuePerImpression = variants.map(v => ({
      id: v.id,
      rpi: v.revenue / v.impressions
    }));

    const winner = revenuePerImpression.reduce((max, v) => 
      v.rpi > max.rpi ? v : max
    );

    // Calculate statistical confidence (simplified)
    const confidence = totalImpressions > 1000 ? 0.95 : 
                      totalImpressions > 500 ? 0.85 : 0.70;

    return {
      variants,
      winner: winner.id,
      confidence,
      startDate: this.lastUpdate,
      sampleSize: totalImpressions
    };
  }

  /**
   * Update current price
   */
  updatePrice(newPrice: number, volume: number = 0, revenue: number = 0): void {
    const conversionRate = volume > 0 ? volume / 100 : 0; // Assuming 100 impressions

    this.priceHistory.push({
      timestamp: new Date(),
      price: this.currentPrice,
      volume,
      revenue,
      conversion_rate: conversionRate
    });

    // Keep last 1000 data points
    if (this.priceHistory.length > 1000) {
      this.priceHistory = this.priceHistory.slice(-1000);
    }

    this.currentPrice = newPrice;
    this.lastUpdate = new Date();

    console.log(`📈 Price updated: ${newPrice.toFixed(2)} ${this.config.currency}`);
  }

  /**
   * Get pricing metrics
   */
  getMetrics(): PricingMetrics {
    const prices = this.priceHistory.map(h => h.price);
    const averagePrice = prices.reduce((sum, p) => sum + p, 0) / Math.max(1, prices.length);
    
    const variance = this.calculateVariance(prices);
    const priceVolatility = Math.sqrt(variance);

    const totalRevenue = this.priceHistory.reduce((sum, h) => sum + h.revenue, 0);
    const totalVolume = this.priceHistory.reduce((sum, h) => sum + h.volume, 0);
    const avgConversionRate = this.priceHistory.reduce((sum, h) => sum + h.conversion_rate, 0) / Math.max(1, this.priceHistory.length);

    return {
      currentPrice: this.currentPrice,
      averagePrice,
      priceVolatility,
      totalRevenue,
      totalVolume,
      averageConversionRate: avgConversionRate,
      abTestResults: this.analyzeABTest()
    };
  }

  /**
   * Calculate variance
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

    return variance;
  }

  /**
   * Get current price
   */
  getCurrentPrice(): number {
    return this.currentPrice;
  }

  /**
   * Get price history
   */
  getHistory(): HistoricalDataPoint[] {
    return [...this.priceHistory];
  }

  /**
   * Reset A/B tests
   */
  resetABTests(): void {
    this.initializeABTests();
    console.log('🔄 A/B tests reset');
  }
}
