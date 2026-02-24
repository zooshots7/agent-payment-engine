/**
 * Route Optimizer Demo
 * 
 * This example demonstrates how to use the RouteOptimizer to find
 * optimal cross-chain payment routes with minimum cost and time.
 */

import { RouteOptimizer, RouteConfig, ChainId } from '../src/strategy/route-optimizer';

async function main() {
  console.log('🚀 Route Optimizer Demo\n');

  // 1. Configure route optimization
  const config: RouteConfig = {
    enabled: true,
    chains: ['solana', 'base', 'ethereum', 'arbitrum', 'polygon', 'optimism'],
    optimizeFor: 'balance', // cost | speed | balance
    maxHops: 3,
    slippageTolerance: 0.5,
    bridges: ['Wormhole', 'Mayan', 'Allbridge', 'Stargate', 'Hop'],
    gasMultiplier: 1.2 // 20% buffer for gas volatility
  };

  // 2. Create optimizer instance
  const optimizer = new RouteOptimizer(config);

  console.log('📊 Route Optimizer Configuration:');
  console.log(`  Optimization: ${config.optimizeFor}`);
  console.log(`  Max Hops: ${config.maxHops}`);
  console.log(`  Supported Chains: ${config.chains.length}`);
  console.log(`  Supported Bridges: ${config.bridges.length}`);
  console.log(`  Gas Multiplier: ${config.gasMultiplier}x\n`);

  // 3. Example 1: Solana to Ethereum (common route)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 1: Solana → Ethereum (1000 USDC)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const route1 = await optimizer.findOptimalRoute('solana', 'ethereum', 1000);
  displayRoute(route1, 'solana', 'ethereum', 1000);

  // 4. Example 2: Base to Arbitrum (L2 to L2)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 2: Base → Arbitrum (500 USDC)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const route2 = await optimizer.findOptimalRoute('base', 'arbitrum', 500);
  displayRoute(route2, 'base', 'arbitrum', 500);

  // 5. Example 3: Compare optimization strategies
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 3: Strategy Comparison');
  console.log('Ethereum → Solana (2000 USDC)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Cost-optimized
  const costOptimizer = new RouteOptimizer({ ...config, optimizeFor: 'cost' });
  const costRoute = await costOptimizer.findOptimalRoute('ethereum', 'solana', 2000);
  console.log('💰 Cost-Optimized Route:');
  console.log(`  Total Cost: $${costRoute.totalCost.toFixed(2)}`);
  console.log(`  Total Time: ${costRoute.totalTime}s (${Math.round(costRoute.totalTime / 60)}m)`);
  console.log(`  Success Rate: ${(costRoute.successProbability * 100).toFixed(1)}%`);
  console.log(`  Path: ${costRoute.path.map(h => `${h.fromChain} → ${h.toChain} (${h.bridge})`).join(' → ')}\n`);

  // Speed-optimized
  const speedOptimizer = new RouteOptimizer({ ...config, optimizeFor: 'speed' });
  const speedRoute = await speedOptimizer.findOptimalRoute('ethereum', 'solana', 2000);
  console.log('⚡ Speed-Optimized Route:');
  console.log(`  Total Cost: $${speedRoute.totalCost.toFixed(2)}`);
  console.log(`  Total Time: ${speedRoute.totalTime}s (${Math.round(speedRoute.totalTime / 60)}m)`);
  console.log(`  Success Rate: ${(speedRoute.successProbability * 100).toFixed(1)}%`);
  console.log(`  Path: ${speedRoute.path.map(h => `${h.fromChain} → ${h.toChain} (${h.bridge})`).join(' → ')}\n`);

  // Balanced
  const balancedOptimizer = new RouteOptimizer({ ...config, optimizeFor: 'balance' });
  const balancedRoute = await balancedOptimizer.findOptimalRoute('ethereum', 'solana', 2000);
  console.log('⚖️  Balanced Route:');
  console.log(`  Total Cost: $${balancedRoute.totalCost.toFixed(2)}`);
  console.log(`  Total Time: ${balancedRoute.totalTime}s (${Math.round(balancedRoute.totalTime / 60)}m)`);
  console.log(`  Success Rate: ${(balancedRoute.successProbability * 100).toFixed(1)}%`);
  console.log(`  Path: ${balancedRoute.path.map(h => `${h.fromChain} → ${h.toChain} (${h.bridge})`).join(' → ')}\n`);

  // 6. Example 4: Gas price monitoring
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 4: Current Gas Prices');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const gasPrices = optimizer.getGasPrices();
  console.log('⛽ Live Gas Prices:\n');
  
  for (const [chain, prices] of gasPrices.entries()) {
    console.log(`  ${chain.toUpperCase()}:`);
    console.log(`    Standard: ${prices.standard} gwei`);
    console.log(`    Fast: ${prices.fast} gwei`);
    console.log(`    Instant: ${prices.instant} gwei`);
    console.log(`    Updated: ${prices.lastUpdated.toLocaleTimeString()}\n`);
  }

  // 7. Example 5: Small vs Large transfers
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 5: Amount Impact Analysis');
  console.log('Solana → Base');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const amounts = [100, 500, 1000, 5000, 10000];
  
  console.log('💵 Cost vs Amount:\n');
  console.log('Amount (USDC) | Total Cost | Cost % | Time (min) | Success Rate');
  console.log('─────────────────────────────────────────────────────────────');
  
  for (const amount of amounts) {
    const route = await optimizer.findOptimalRoute('solana', 'base', amount);
    const costPercent = (route.totalCost / amount) * 100;
    const timeMin = Math.round(route.totalTime / 60);
    const successRate = (route.successProbability * 100).toFixed(1);
    
    console.log(
      `${amount.toString().padStart(13)} | $${route.totalCost.toFixed(2).padStart(9)} | ${costPercent.toFixed(2).padStart(5)}% | ${timeMin.toString().padStart(10)} | ${successRate.padStart(12)}%`
    );
  }

  console.log('\n📈 Key Insights:');
  console.log('  • Larger transfers have lower percentage costs (fixed fees amortized)');
  console.log('  • Time remains relatively constant regardless of amount');
  console.log('  • Success probability slightly higher for smaller amounts\n');

  // 8. Supported chains & bridges
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Supported Infrastructure');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🌐 Chains:');
  optimizer.getSupportedChains().forEach(chain => {
    console.log(`  • ${chain}`);
  });

  console.log('\n🌉 Bridges:');
  optimizer.getSupportedBridges().forEach(bridge => {
    console.log(`  • ${bridge}`);
  });

  console.log('\n✨ Done!\n');
}

function displayRoute(
  route: any,
  fromChain: ChainId,
  toChain: ChainId,
  amount: number
): void {
  console.log('📍 Route Details:\n');
  
  if (route.path.length === 0) {
    console.log('  Same chain - no bridge needed');
    return;
  }

  // Display each hop
  route.path.forEach((hop: any, index: number) => {
    console.log(`  Hop ${index + 1}:`);
    console.log(`    Bridge: ${hop.bridge}`);
    console.log(`    Path: ${hop.fromChain} → ${hop.toChain}`);
    console.log(`    Amount: ${hop.amount} USDC`);
    console.log(`    Cost: $${hop.estimatedCost.toFixed(2)} (Gas: $${hop.gasEstimate.toFixed(2)})`);
    console.log(`    Time: ${hop.estimatedTime}s (${Math.round(hop.estimatedTime / 60)}m)`);
    console.log('');
  });

  // Display totals
  console.log('📊 Summary:');
  console.log(`  Total Hops: ${route.totalHops}`);
  console.log(`  Total Cost: $${route.totalCost.toFixed(2)}`);
  console.log(`  Cost Percentage: ${((route.totalCost / amount) * 100).toFixed(2)}%`);
  console.log(`  Total Time: ${route.totalTime}s (${Math.round(route.totalTime / 60)}m)`);
  console.log(`  Success Probability: ${(route.successProbability * 100).toFixed(1)}%`);
  console.log(`  Recommendation: ${route.recommendation}`);
  
  // Final amount after fees
  const finalAmount = amount - route.totalCost;
  console.log(`  \n  Sending: ${amount} USDC`);
  console.log(`  Receiving: ${finalAmount.toFixed(2)} USDC`);
}

// Run the demo
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

/**
 * Example Output:
 * 
 * 🚀 Route Optimizer Demo
 * 
 * 📊 Route Optimizer Configuration:
 *   Optimization: balance
 *   Max Hops: 3
 *   Supported Chains: 6
 *   Supported Bridges: 5
 *   Gas Multiplier: 1.2x
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Example 1: Solana → Ethereum (1000 USDC)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 🔍 Finding optimal route: solana → ethereum (1000 USDC)
 * ✅ Found optimal route with 1 hop(s)
 * 💰 Total cost: $8.12
 * ⏱️  Estimated time: 180s
 * 
 * 📍 Route Details:
 * 
 *   Hop 1:
 *     Bridge: Wormhole
 *     Path: solana → ethereum
 *     Amount: 1000 USDC
 *     Cost: $8.12 (Gas: $7.12)
 *     Time: 180s (3m)
 * 
 * 📊 Summary:
 *   Total Hops: 1
 *   Total Cost: $8.12
 *   Cost Percentage: 0.81%
 *   Total Time: 180s (3m)
 *   Success Probability: 98.0%
 *   Recommendation: Single bridge hop - optimal
 *   
 *   Sending: 1000 USDC
 *   Receiving: 991.88 USDC
 * 
 * ...
 */
