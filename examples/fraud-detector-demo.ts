/**
 * Fraud Detection Demo
 * 
 * This example demonstrates the ML-powered fraud detection system
 * with real-world scenarios and edge cases.
 */

import {
  FraudDetector,
  FraudConfig,
  Transaction,
  GeoLocation
} from '../src/ml/fraud-detector';

async function main() {
  console.log('🛡️  Fraud Detection ML Demo\n');

  // 1. Configure fraud detection system
  const config: FraudConfig = {
    enabled: true,
    models: [
      'velocity_check',
      'amount_anomaly',
      'pattern_recognition',
      'geo_anomaly',
      'behavioral'
    ],
    actions: {
      safe: 'approve',
      low: 'approve',
      medium: 'flag',
      high: 'block',
      critical: 'block'
    },
    thresholds: {
      velocity: 10, // Max 10 tx/hour
      anomalyScore: 0.85,
      amountDeviation: 3, // 3 standard deviations
      geoDistance: 1000, // km
      riskScore: {
        safe: 0.1,
        low: 0.3,
        medium: 0.5,
        high: 0.7
      }
    },
    enableLearning: true,
    alertWebhook: 'https://alerts.example.com/fraud'
  };

  const detector = new FraudDetector(config);

  console.log('📊 Fraud Detection Configuration:');
  console.log(`  Models: ${config.models.length} enabled`);
  console.log(`  Velocity Threshold: ${config.thresholds.velocity} tx/hour`);
  console.log(`  Amount Deviation: ${config.thresholds.amountDeviation} σ`);
  console.log(`  Learning: ${config.enableLearning ? 'Enabled' : 'Disabled'}\n`);

  // Geo locations for testing
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

  // 2. Example 1: Normal Transaction
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 1: Normal Transaction ✅');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const normalTx: Transaction = {
    id: 'tx-normal-001',
    userId: 'user-alice',
    amount: 125.50,
    timestamp: new Date(),
    fromAddress: '0xAlice',
    toAddress: '0xBob',
    chain: 'ethereum',
    ipAddress: '192.168.1.100',
    geoLocation: newYork
  };

  const normalAnalysis = await detector.analyzeTransaction(normalTx);
  displayAnalysis(normalAnalysis, normalTx);

  // 3. Example 2: Velocity Attack (Rapid Transactions)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 2: Velocity Attack 🚨');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Simulating rapid transaction burst...\n');

  // Send 12 transactions rapidly
  for (let i = 0; i < 12; i++) {
    const tx: Transaction = {
      id: `tx-velocity-${i}`,
      userId: 'user-attacker',
      amount: 50 + Math.random() * 50,
      timestamp: new Date(Date.now() - (12 - i) * 60000), // Last 12 minutes
      fromAddress: '0xAttacker',
      toAddress: `0xVictim${i}`,
      chain: 'ethereum',
      ipAddress: '10.0.0.1',
      geoLocation: london
    };

    const analysis = await detector.analyzeTransaction(tx);
    
    if (i === 11) {
      console.log(`Transaction #${i + 1}/${12}:`);
      displayAnalysis(analysis, tx);
    }
  }

  // 4. Example 3: Amount Anomaly
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 3: Amount Anomaly Detection 💰');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Establishing baseline (small transactions)...\n');

  // Establish baseline with small amounts
  for (let i = 0; i < 5; i++) {
    const tx: Transaction = {
      id: `tx-baseline-${i}`,
      userId: 'user-bob',
      amount: 100 + Math.random() * 20,
      timestamp: new Date(Date.now() - (5 - i) * 3600000),
      fromAddress: '0xBob',
      toAddress: '0xShop',
      chain: 'base',
      ipAddress: '192.168.1.200',
      geoLocation: newYork
    };

    await detector.analyzeTransaction(tx);
    console.log(`  Transaction ${i + 1}: ${tx.amount.toFixed(2)} USDC`);
  }

  console.log('\n📈 Average: ~110 USDC');
  console.log('🎯 Sending unusually large transaction...\n');

  // Unusual large amount
  const largeTx: Transaction = {
    id: 'tx-large-001',
    userId: 'user-bob',
    amount: 10000, // 100x larger than baseline
    timestamp: new Date(),
    fromAddress: '0xBob',
    toAddress: '0xShop',
    chain: 'base',
    ipAddress: '192.168.1.200',
    geoLocation: newYork
  };

  const largeAnalysis = await detector.analyzeTransaction(largeTx);
  displayAnalysis(largeAnalysis, largeTx);

  // 5. Example 4: Impossible Travel
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 4: Impossible Travel 🌍');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const tx1: Transaction = {
    id: 'tx-travel-1',
    userId: 'user-charlie',
    amount: 200,
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    fromAddress: '0xCharlie',
    toAddress: '0xMerchant',
    chain: 'ethereum',
    ipAddress: '50.0.0.1',
    geoLocation: newYork
  };

  console.log('Transaction 1: New York → Shop (1 hour ago)');
  await detector.analyzeTransaction(tx1);

  console.log('Transaction 2: Tokyo → Shop (now)');
  console.log('⚠️  Distance: ~10,850 km in 1 hour!\n');

  const tx2: Transaction = {
    id: 'tx-travel-2',
    userId: 'user-charlie',
    amount: 300,
    timestamp: new Date(),
    fromAddress: '0xCharlie',
    toAddress: '0xMerchant',
    chain: 'ethereum',
    ipAddress: '60.0.0.1',
    geoLocation: tokyo
  };

  const travelAnalysis = await detector.analyzeTransaction(tx2);
  displayAnalysis(travelAnalysis, tx2);

  // 6. Example 5: Pattern Detection (Sequential Amounts)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 5: Pattern Detection 🔍');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Sending sequential amounts (100, 200, 300, 400)...\n');

  for (let i = 1; i <= 4; i++) {
    const tx: Transaction = {
      id: `tx-pattern-${i}`,
      userId: 'user-dave',
      amount: i * 100,
      timestamp: new Date(Date.now() - (4 - i) * 600000),
      fromAddress: '0xDave',
      toAddress: '0xSuspicious',
      chain: 'solana',
      ipAddress: '192.168.1.50'
    };

    const analysis = await detector.analyzeTransaction(tx);
    
    if (i === 4) {
      displayAnalysis(analysis, tx);
    } else {
      console.log(`  Transaction ${i}: ${tx.amount} USDC`);
    }
  }

  // 7. Example 6: Blocked Address
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Example 6: Blocked Address ⛔');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const blockedAddr = '0xKnownScammer';
  console.log(`Adding ${blockedAddr} to blocklist...\n`);
  detector.blockAddress(blockedAddr);

  const blockedTx: Transaction = {
    id: 'tx-blocked-001',
    userId: 'user-victim',
    amount: 500,
    timestamp: new Date(),
    fromAddress: blockedAddr,
    toAddress: '0xVictim',
    chain: 'ethereum',
    ipAddress: '66.66.66.66'
  };

  const blockedAnalysis = await detector.analyzeTransaction(blockedTx);
  displayAnalysis(blockedAnalysis, blockedTx);

  // 8. Statistics Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('System Statistics 📊');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const stats = detector.getStatistics();
  console.log(`Total Users: ${stats.totalUsers}`);
  console.log(`Total Transactions: ${stats.totalTransactions}`);
  console.log(`Blocked Addresses: ${stats.blockedAddresses}`);
  console.log(`Known Patterns: ${stats.knownPatterns}\n`);

  // 9. User Profile Example
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('User Profile Example 👤');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const bobProfile = detector.getProfile('user-bob');
  if (bobProfile) {
    console.log(`User ID: ${bobProfile.userId}`);
    console.log(`Total Transactions: ${bobProfile.totalTransactions}`);
    console.log(`Total Volume: ${bobProfile.totalVolume.toFixed(2)} USDC`);
    console.log(`Average Amount: ${bobProfile.averageAmount.toFixed(2)} USDC`);
    console.log(`Common Chains: ${bobProfile.commonChains.join(', ')}`);
    console.log(`Risk Score: ${bobProfile.riskScore.toFixed(2)}`);
    console.log(`Last Activity: ${bobProfile.lastActivity.toLocaleString()}\n`);
  }

  console.log('✨ Demo Complete!\n');
}

function displayAnalysis(analysis: any, tx: Transaction): void {
  console.log(`📋 Transaction: ${tx.id}`);
  console.log(`   Amount: ${tx.amount} USDC`);
  console.log(`   Chain: ${tx.chain}`);
  if (tx.geoLocation) {
    console.log(`   Location: ${tx.geoLocation.city}, ${tx.geoLocation.country}`);
  }
  console.log('');

  // Risk assessment
  const riskEmoji = {
    safe: '✅',
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    critical: '🔴'
  };

  console.log(`${riskEmoji[analysis.riskLevel]} Risk Level: ${analysis.riskLevel.toUpperCase()}`);
  console.log(`   Risk Score: ${(analysis.riskScore * 100).toFixed(1)}%`);
  console.log(`   Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
  console.log(`   Recommendation: ${analysis.recommendation.toUpperCase()}`);
  console.log('');

  // Fraud signals
  if (analysis.signals.length > 0) {
    console.log(`⚠️  Fraud Signals (${analysis.signals.length}):`);
    analysis.signals.forEach((signal: any, idx: number) => {
      const severityEmoji = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        critical: '🔴'
      };
      console.log(`   ${idx + 1}. ${severityEmoji[signal.severity]} [${signal.type}] ${signal.description}`);
      console.log(`      Confidence: ${(signal.confidence * 100).toFixed(0)}%`);
    });
    console.log('');
  }

  // Reasoning
  console.log('💡 Analysis Reasoning:');
  analysis.reasoning.forEach((reason: string) => {
    console.log(`   ${reason}`);
  });
  console.log('');
}

// Run the demo
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

/**
 * Example Output:
 * 
 * 🛡️  Fraud Detection ML Demo
 * 
 * 📊 Fraud Detection Configuration:
 *   Models: 5 enabled
 *   Velocity Threshold: 10 tx/hour
 *   Amount Deviation: 3 σ
 *   Learning: Enabled
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Example 1: Normal Transaction ✅
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 🔍 Analyzing transaction tx-normal-001 for fraud...
 * ✅ Analysis complete: safe risk (0.0%)
 * 
 * 📋 Transaction: tx-normal-001
 *    Amount: 125.5 USDC
 *    Chain: ethereum
 *    Location: New York, USA
 * 
 * ✅ Risk Level: SAFE
 *    Risk Score: 0.0%
 *    Confidence: 100.0%
 *    Recommendation: APPROVE
 * 
 * 💡 Analysis Reasoning:
 *    No fraud indicators detected
 *    Transaction appears normal
 * 
 * ...
 */
