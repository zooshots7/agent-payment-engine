/**
 * Yield Optimizer Demo
 * 
 * This example demonstrates how to use the YieldOptimizer to automatically
 * optimize yield across multiple DeFi protocols on Solana.
 */

import { Connection, Keypair } from '@solana/web3.js';
import { YieldOptimizer, YieldStrategy } from '../src/strategy/yield-optimizer';
import { AgentWallet } from '../src/core/wallet';

async function main() {
  console.log('🚀 Yield Optimizer Demo\n');

  // 1. Set up connection and wallet
  const connection = new Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );

  // In production, load keypair securely from environment
  const wallet = new AgentWallet(Keypair.generate());
  console.log(`💼 Agent Wallet: ${wallet.getPublicKey().toBase58()}\n`);

  // 2. Define yield optimization strategy
  const strategy: YieldStrategy = {
    strategy: 'balanced', // conservative | balanced | aggressive
    minBalanceThreshold: 1000, // Minimum 1000 USDC to optimize
    protocols: [
      {
        name: 'Kamino',
        address: 'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD',
        apy: 8.5,
        tvl: 500_000_000,
        riskLevel: 'low',
        weight: 0.5, // 50% allocation
        minDeposit: 100
      },
      {
        name: 'Marginfi',
        address: 'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA',
        apy: 7.2,
        tvl: 300_000_000,
        riskLevel: 'medium',
        weight: 0.3, // 30% allocation
        minDeposit: 100
      },
      {
        name: 'Drift',
        address: 'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH',
        apy: 9.1,
        tvl: 200_000_000,
        riskLevel: 'medium',
        weight: 0.2, // 20% allocation
        minDeposit: 100
      }
    ],
    rebalanceFrequency: 'hourly',
    emergencyReserve: 100, // Keep 100 USDC liquid
    maxSlippage: 0.5 // 0.5% max slippage
  };

  // 3. Create optimizer instance
  const optimizer = new YieldOptimizer(connection, wallet, strategy);

  // 4. Start the optimizer
  console.log('📊 Strategy Configuration:');
  console.log(`  Risk Level: ${strategy.strategy}`);
  console.log(`  Protocols: ${strategy.protocols.length}`);
  console.log(`  Rebalance: ${strategy.rebalanceFrequency}`);
  console.log(`  Emergency Reserve: ${strategy.emergencyReserve} USDC\n`);

  await optimizer.start();

  // 5. Monitor positions
  console.log('\n💰 Current Positions:');
  const positions = optimizer.getPositions();
  if (positions.length === 0) {
    console.log('  No positions yet (balance below threshold or first run)\n');
  } else {
    positions.forEach(pos => {
      console.log(`  ${pos.protocol}: ${pos.amount} USDC @ ${pos.apy}% APY`);
    });
    console.log(`\n  Total Value: ${optimizer.getTotalValue()} USDC\n`);
  }

  // 6. Run manual optimization (in addition to automatic scheduling)
  console.log('\n🔄 Running manual optimization...\n');
  const report = await optimizer.optimize();

  // 7. Display results
  console.log('📈 Optimization Report:');
  console.log(`  Total Portfolio Value: ${report.totalValue.toFixed(2)} USDC`);
  console.log(`  Weighted APY: ${report.totalYield.toFixed(2)}%`);
  console.log(`  Performance vs Baseline: ${report.performanceVsBaseline > 0 ? '+' : ''}${report.performanceVsBaseline.toFixed(2)}%`);
  console.log(`  Last Rebalance: ${report.lastRebalance.toLocaleString()}`);
  console.log(`  Next Rebalance: ${report.nextRebalance.toLocaleString()}\n`);

  if (report.positions.length > 0) {
    console.log('📊 Position Breakdown:');
    report.positions.forEach(pos => {
      const percentage = (pos.value / report.totalValue) * 100;
      console.log(`  ${pos.protocol}:`);
      console.log(`    Amount: ${pos.amount.toFixed(2)} USDC`);
      console.log(`    APY: ${pos.apy.toFixed(2)}%`);
      console.log(`    Allocation: ${percentage.toFixed(1)}%`);
      console.log(`    Last Updated: ${pos.lastUpdated.toLocaleString()}\n`);
    });
  }

  // 8. Keep running for demonstration (in production, this would run continuously)
  console.log('⏰ Optimizer is now running automatically...');
  console.log('   Press Ctrl+C to stop\n');

  // Keep process alive
  await new Promise(resolve => setTimeout(resolve, 60000)); // Run for 1 minute

  // 9. Clean shutdown
  optimizer.stop();
  console.log('👋 Optimizer stopped gracefully');
}

// Run the demo
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

/**
 * Example Output:
 * 
 * 🚀 Yield Optimizer Demo
 * 
 * 💼 Agent Wallet: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
 * 
 * 📊 Strategy Configuration:
 *   Risk Level: balanced
 *   Protocols: 3
 *   Rebalance: hourly
 *   Emergency Reserve: 100 USDC
 * 
 * 🚀 Starting Yield Optimizer...
 * Strategy: balanced
 * Monitoring 3 protocols
 * 🔍 Analyzing yield opportunities...
 * 💰 Current balance: 5000 USDC
 * 📊 Protocol APYs fetched:
 *   Kamino: 8.5% APY (Risk: low)
 *   Marginfi: 7.2% APY (Risk: medium)
 *   Drift: 9.1% APY (Risk: medium)
 * 💡 Optimal allocation:
 *   Kamino: 2450 USDC
 *   Marginfi: 1470 USDC
 *   Drift: 980 USDC
 * ⚡ Executing rebalance...
 * 📥 Depositing 2450 USDC to Kamino...
 * ✅ Deposit to Kamino complete
 * 📥 Depositing 1470 USDC to Marginfi...
 * ✅ Deposit to Marginfi complete
 * 📥 Depositing 980 USDC to Drift...
 * ✅ Deposit to Drift complete
 * ✅ Rebalance complete!
 * ⏰ Next rebalance in hourly
 * 
 * 💰 Current Positions:
 *   Kamino: 2450 USDC @ 8.5% APY
 *   Marginfi: 1470 USDC @ 7.2% APY
 *   Drift: 980 USDC @ 9.1% APY
 * 
 *   Total Value: 4900 USDC
 * 
 * 🔄 Running manual optimization...
 * 
 * 🔍 Analyzing yield opportunities...
 * 💰 Current balance: 5000 USDC
 * 📊 Protocol APYs fetched:
 *   Kamino: 8.5% APY (Risk: low)
 *   Marginfi: 7.2% APY (Risk: medium)
 *   Drift: 9.1% APY (Risk: medium)
 * 💡 Optimal allocation:
 *   Kamino: 2450 USDC
 *   Marginfi: 1470 USDC
 *   Drift: 980 USDC
 * ✅ Current allocation is optimal, no rebalance needed
 * 
 * 📈 Optimization Report:
 *   Total Portfolio Value: 4900.00 USDC
 *   Weighted APY: 8.22%
 *   Performance vs Baseline: +64.40%
 *   Last Rebalance: 2/24/2026, 7:30:00 PM
 *   Next Rebalance: 2/24/2026, 8:30:00 PM
 * 
 * 📊 Position Breakdown:
 *   Kamino:
 *     Amount: 2450.00 USDC
 *     APY: 8.50%
 *     Allocation: 50.0%
 *     Last Updated: 2/24/2026, 7:30:00 PM
 * 
 *   Marginfi:
 *     Amount: 1470.00 USDC
 *     APY: 7.20%
 *     Allocation: 30.0%
 *     Last Updated: 2/24/2026, 7:30:00 PM
 * 
 *   Drift:
 *     Amount: 980.00 USDC
 *     APY: 9.10%
 *     Allocation: 20.0%
 *     Last Updated: 2/24/2026, 7:30:00 PM
 * 
 * ⏰ Optimizer is now running automatically...
 *    Press Ctrl+C to stop
 */
