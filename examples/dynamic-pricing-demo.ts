/**
 * Dynamic Pricing Demo
 * 
 * This example demonstrates the AI-driven dynamic pricing engine
 * with real-world market scenarios and A/B testing.
 */

import {
  DynamicPricing,
  PricingConfig,
  MarketData,
  AdjustmentFactor
} from '../src/strategy/dynamic-pricing';

async function main() {
  console.log('💰 Dynamic Pricing AI Demo\n');

  // 1. Configure pricing engine
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

  const config: PricingConfig = {
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

  const pricing = new DynamicPricing(config);

  console.log('📊 Pricing Configuration:');
  console.log(`  Base Price: ${config.basePrice} ${config.currency}`);
  console.log(`  Price Floor: ${config.priceFloor} ${config.currency}`);
  console.log(`  Price Ceiling: ${config.priceCeiling} ${config.currency}`);
  console.log(`  Adjustment Factors: ${config.adjustmentFactors.length}`);
  console.log(`  A/B Testing: ${config.abTestingEnabled ? 'Enabled' : 'Disabled'}`);
  console.log('');

  // 2. Scenario 1: Normal Market Conditions
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Scenario 1: Normal Market Conditions');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const normalMarket: MarketData = {
    timestamp: new Date(),
    demand: 0.5,
    supply: 0.5,
    competitorPrices: [
      { competitor: 'Competitor A', price: 10.5, timestamp: new Date() },
      { competitor: 'Competitor B', price: 9.8, timestamp: new Date() },
      { competitor: 'Competitor C', price: 10.2, timestamp: new Date() }
    ],
    historicalData: []
  };

  const normalRec = await pricing.calculateOptimalPrice(normalMarket);
  displayRecommendation('Normal Market', normalRec, normalMarket);

  // 3. Scenario 2: High Demand (Peak Hours)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Scenario 2: High Demand (Peak Hours)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const highDemand: MarketData = {
    timestamp: new Date(),
    demand: 0.9,
    supply: 0.3,
    competitorPrices: [
      { competitor: 'Competitor A', price: 12.0, timestamp: new Date() },
      { competitor: 'Competitor B', price: 11.5, timestamp: new Date() },
      { competitor: 'Competitor C', price: 13.0, timestamp: new Date() }
    ],
    historicalData: []
  };

  const highDemandRec = await pricing.calculateOptimalPrice(highDemand);
  displayRecommendation('High Demand', highDemandRec, highDemand);

  // 4. Scenario 3: Low Demand (Off-Peak)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Scenario 3: Low Demand (Off-Peak)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const lowDemand: MarketData = {
    timestamp: new Date(),
    demand: 0.2,
    supply: 0.9,
    competitorPrices: [
      { competitor: 'Competitor A', price: 8.0, timestamp: new Date() },
      { competitor: 'Competitor B', price: 7.5, timestamp: new Date() },
      { competitor: 'Competitor C', price: 8.5, timestamp: new Date() }
    ],
    historicalData: []
  };

  const lowDemandRec = await pricing.calculateOptimalPrice(lowDemand);
  displayRecommendation('Low Demand', lowDemandRec, lowDemand);

  // 5. Scenario 4: Competitor Price War
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Scenario 4: Competitor Price War');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const priceWar: MarketData = {
    timestamp: new Date(),
    demand: 0.6,
    supply: 0.7,
    competitorPrices: [
      { competitor: 'Aggressive Comp', price: 6.0, timestamp: new Date(), market_share: 0.4 },
      { competitor: 'Medium Comp', price: 9.0, timestamp: new Date(), market_share: 0.3 },
      { competitor: 'Premium Comp', price: 15.0, timestamp: new Date(), market_share: 0.3 }
    ],
    historicalData: []
  };

  const priceWarRec = await pricing.calculateOptimalPrice(priceWar);
  displayRecommendation('Price War', priceWarRec, priceWar);

  // 6. Scenario 5: Supply Shortage
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Scenario 5: Supply Shortage');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const shortage: MarketData = {
    timestamp: new Date(),
    demand: 0.8,
    supply: 0.1,
    competitorPrices: [
      { competitor: 'Competitor A', price: 20.0, timestamp: new Date() },
      { competitor: 'Competitor B', price: 18.0, timestamp: new Date() }
    ],
    historicalData: []
  };

  const shortageRec = await pricing.calculateOptimalPrice(shortage);
  displayRecommendation('Supply Shortage', shortageRec, shortage);

  // 7. Simulate Price Updates and History
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Simulating Price History (24 Hours)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Hour | Demand | Supply | Price    | Volume | Revenue');
  console.log('──────────────────────────────────────────────────────');

  for (let hour = 0; hour < 24; hour++) {
    // Simulate demand curve (higher during business hours)
    const demand = 0.3 + 0.4 * Math.sin((hour - 6) * Math.PI / 12);
    const supply = 0.8 - 0.3 * Math.sin((hour - 6) * Math.PI / 12);

    const marketData: MarketData = {
      timestamp: new Date(Date.now() + hour * 3600000),
      demand: Math.max(0, Math.min(1, demand)),
      supply: Math.max(0, Math.min(1, supply)),
      competitorPrices: [
        { competitor: 'Comp', price: 10 + Math.random() * 2, timestamp: new Date() }
      ],
      historicalData: []
    };

    const rec = await pricing.calculateOptimalPrice(marketData);
    
    // Simulate volume based on price and demand
    const volume = Math.floor(demand * 100 * (1 - (rec.recommendedPrice - 10) / 20));
    const revenue = volume * rec.recommendedPrice;

    // Update pricing with actual performance
    pricing.updatePrice(rec.recommendedPrice, volume, revenue);

    console.log(
      `${hour.toString().padStart(4)}h | ${(demand * 100).toFixed(0).padStart(5)}% | ` +
      `${(supply * 100).toFixed(0).padStart(5)}% | $${rec.recommendedPrice.toFixed(2).padStart(6)} | ` +
      `${volume.toString().padStart(6)} | $${revenue.toFixed(0).padStart(6)}`
    );

    // Record some A/B test conversions
    if (rec.abTestVariant && Math.random() > 0.7) {
      pricing.recordConversion(rec.abTestVariant, revenue);
    }
  }

  // 8. Display Metrics
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Pricing Metrics (24 Hours)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const metrics = pricing.getMetrics();

  console.log('📊 Performance Summary:');
  console.log(`  Current Price: ${metrics.currentPrice.toFixed(2)} ${config.currency}`);
  console.log(`  Average Price: ${metrics.averagePrice.toFixed(2)} ${config.currency}`);
  console.log(`  Price Volatility: ${metrics.priceVolatility.toFixed(2)}`);
  console.log(`  Total Volume: ${metrics.totalVolume} transactions`);
  console.log(`  Total Revenue: ${metrics.totalRevenue.toFixed(2)} ${config.currency}`);
  console.log(`  Avg Conversion Rate: ${(metrics.averageConversionRate * 100).toFixed(1)}%`);
  console.log('');

  // 9. A/B Test Results
  if (metrics.abTestResults) {
    console.log('🧪 A/B Test Results:\n');
    
    metrics.abTestResults.variants.forEach(variant => {
      const convRate = variant.impressions > 0 
        ? (variant.conversions / variant.impressions * 100).toFixed(1)
        : '0.0';
      const rpi = variant.impressions > 0
        ? (variant.revenue / variant.impressions).toFixed(2)
        : '0.00';

      console.log(`  ${variant.name}:`);
      console.log(`    Price Multiplier: ${variant.priceMultiplier}x`);
      console.log(`    Impressions: ${variant.impressions}`);
      console.log(`    Conversions: ${variant.conversions}`);
      console.log(`    Conversion Rate: ${convRate}%`);
      console.log(`    Revenue: $${variant.revenue.toFixed(2)}`);
      console.log(`    Revenue/Impression: $${rpi}`);
      
      if (metrics.abTestResults?.winner === variant.id) {
        console.log(`    🏆 WINNER (${(metrics.abTestResults.confidence * 100).toFixed(0)}% confidence)`);
      }
      console.log('');
    });

    console.log(`  Sample Size: ${metrics.abTestResults.sampleSize}`);
    console.log(`  Started: ${metrics.abTestResults.startDate.toLocaleString()}`);
  }

  // 10. Price History Chart (ASCII)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Price History (Last 24 Hours)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const history = pricing.getHistory();
  const maxPrice = Math.max(...history.map(h => h.price));
  const minPrice = Math.min(...history.map(h => h.price));

  console.log(`High: $${maxPrice.toFixed(2)} | Low: $${minPrice.toFixed(2)} | Range: $${(maxPrice - minPrice).toFixed(2)}\n`);

  // Simple ASCII chart
  const chartHeight = 10;
  for (let row = chartHeight; row >= 0; row--) {
    const priceAtRow = minPrice + (maxPrice - minPrice) * (row / chartHeight);
    let line = `$${priceAtRow.toFixed(1).padStart(5)} |`;
    
    for (let i = 0; i < history.length; i++) {
      const price = history[i].price;
      if (Math.abs(price - priceAtRow) < (maxPrice - minPrice) / chartHeight) {
        line += '█';
      } else {
        line += ' ';
      }
    }
    console.log(line);
  }
  console.log('       ' + '─'.repeat(history.length));
  console.log('       0h' + ' '.repeat(history.length - 9) + '24h');

  console.log('\n✨ Demo Complete!\n');
}

function displayRecommendation(
  scenario: string,
  rec: any,
  market: MarketData
): void {
  console.log(`📍 Scenario: ${scenario}\n`);

  // Market conditions
  console.log('Market Conditions:');
  console.log(`  Demand: ${(market.demand * 100).toFixed(0)}%`);
  console.log(`  Supply: ${(market.supply * 100).toFixed(0)}%`);
  
  if (market.competitorPrices.length > 0) {
    const avgCompPrice = market.competitorPrices.reduce((sum, c) => sum + c.price, 0) / market.competitorPrices.length;
    console.log(`  Competitor Avg: $${avgCompPrice.toFixed(2)}`);
  }
  console.log('');

  // Recommendation
  const changeEmoji = rec.priceChange > 0 ? '📈' : rec.priceChange < 0 ? '📉' : '➡️';
  console.log(`${changeEmoji} Recommended Price: $${rec.recommendedPrice.toFixed(2)}`);
  console.log(`   Change: ${rec.priceChange >= 0 ? '+' : ''}$${rec.priceChange.toFixed(2)} (${rec.priceChangePercent >= 0 ? '+' : ''}${rec.priceChangePercent.toFixed(1)}%)`);
  console.log(`   Confidence: ${(rec.confidence * 100).toFixed(0)}%`);
  
  if (rec.abTestVariant) {
    console.log(`   A/B Variant: ${rec.abTestVariant}`);
  }
  console.log('');

  // Expected impact
  console.log('Expected Impact:');
  console.log(`  Demand Change: ${rec.expectedImpact.demandChange >= 0 ? '+' : ''}${rec.expectedImpact.demandChange.toFixed(1)}%`);
  console.log(`  Revenue Change: ${rec.expectedImpact.revenueChange >= 0 ? '+' : ''}${rec.expectedImpact.revenueChange.toFixed(1)}%`);
  console.log(`  Margin Change: ${rec.expectedImpact.marginChange >= 0 ? '+' : ''}${rec.expectedImpact.marginChange.toFixed(1)}%`);
  console.log('');

  // Factors
  console.log('Adjustment Factors:');
  rec.factors
    .sort((a: any, b: any) => Math.abs(b.impact) - Math.abs(a.impact))
    .forEach((factor: any) => {
      const impact = factor.impact >= 0 ? '+' : '';
      console.log(`  • ${factor.factor}: ${impact}$${factor.impact.toFixed(2)} (weight: ${factor.weight}, score: ${factor.score.toFixed(2)})`);
    });
  console.log('');

  // Reasoning
  console.log('Reasoning:');
  rec.reasoning.forEach((reason: string) => {
    console.log(`  ${reason}`);
  });
}

// Run the demo
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

/**
 * Example Output:
 * 
 * 💰 Dynamic Pricing AI Demo
 * 
 * 📊 Pricing Configuration:
 *   Base Price: 10 USDC
 *   Price Floor: 5 USDC
 *   Price Ceiling: 50 USDC
 *   Adjustment Factors: 4
 *   A/B Testing: Enabled
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Scenario 1: Normal Market Conditions
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 💰 Calculating optimal price...
 * ✅ Optimal price: 10.15 USDC
 *    Change: +1.5%
 * 
 * 📍 Scenario: Normal Market
 * 
 * Market Conditions:
 *   Demand: 50%
 *   Supply: 50%
 *   Competitor Avg: $10.17
 * 
 * ➡️ Recommended Price: $10.15
 *    Change: +$0.15 (+1.5%)
 *    Confidence: 85%
 *    A/B Variant: control
 * 
 * Expected Impact:
 *   Demand Change: -2.3%
 *   Revenue Change: -0.8%
 *   Margin Change: +0.5%
 * 
 * Adjustment Factors:
 *   • Competitor Price: +$0.20 (weight: 0.8, score: 0.15)
 *   • Time of Day: +$0.05 (weight: 0.5, score: 0.10)
 *   • Capacity: -$0.07 (weight: 0.7, score: 0.00)
 *   • Demand Multiplier: -$0.03 (weight: 1.0, score: 0.00)
 * 
 * Reasoning:
 *   Competitor Price: increase price by 0.20 USDC (score: 0.15)
 *   Time of Day: increase price by 0.05 USDC (score: 0.10)
 *   Recommended price is 0.2% below competitor average
 * 
 * ...
 */
