/**
 * Example: Complete Payment Flow
 * 
 * Demonstrates:
 * 1. Wallet generation
 * 2. Agent creation with wallets
 * 3. Solana connection
 * 4. x402 payment execution
 * 5. Agent-to-agent messaging
 */

import { AgentWallet } from '../src/core/wallet.js';
import { SolanaManager } from '../src/core/solana.js';
import { X402PaymentHandler } from '../src/core/x402.js';
import { AgentManager } from '../src/agents/manager.js';
import { AgentProtocol } from '../src/agents/protocol.js';
import type { AgentConfig } from '../src/types/agent.js';

async function main(): Promise<void> {
  console.log('🚀 Agent Payment Engine - Complete Payment Flow\n');

  // Step 1: Generate wallets for agents
  console.log('💼 Step 1: Generating Agent Wallets...');
  const buyerWallet = AgentWallet.generate('hot');
  const sellerWallet = AgentWallet.generate('hot');

  console.log(`  Buyer Wallet:  ${buyerWallet.getPublicKey()}`);
  console.log(`  Seller Wallet: ${sellerWallet.getPublicKey()}\n`);

  // Step 2: Connect to Solana (devnet for testing)
  console.log('🌐 Step 2: Connecting to Solana Devnet...');
  const solana = new SolanaManager({
    network: 'devnet',
    commitment: 'confirmed',
  });

  console.log(`  Network: ${solana.getNetwork()}`);
  console.log(`  Connection: Active\n`);

  // Step 3: Check balances (will be 0 initially)
  console.log('💰 Step 3: Checking Balances...');
  const buyerBalance = await solana.getBalance(buyerWallet.publicKey);
  const sellerBalance = await solana.getBalance(sellerWallet.publicKey);

  console.log(`  Buyer Balance:  ${buyerBalance} SOL`);
  console.log(`  Seller Balance: ${sellerBalance} SOL\n`);

  // Step 4: Request airdrop (devnet only - free SOL)
  if (buyerBalance < 0.1) {
    console.log('💸 Step 4: Requesting Airdrop (Devnet)...');
    try {
      const signature = await solana.requestAirdrop(buyerWallet.publicKey, 1);
      console.log(`  Airdrop successful! Signature: ${signature.slice(0, 20)}...`);

      const newBalance = await solana.getBalance(buyerWallet.publicKey);
      console.log(`  New Balance: ${newBalance} SOL\n`);
    } catch (error) {
      console.warn(`  Airdrop failed (rate limit?): ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
  } else {
    console.log('✅ Step 4: Sufficient balance, skipping airdrop\n');
  }

  // Step 5: Initialize x402 payment handler
  console.log('🔧 Step 5: Initializing x402 Payment Handler...');
  const x402 = new X402PaymentHandler(solana, {
    defaultCurrency: 'SOL',
    defaultChain: 'solana',
  });
  console.log('  x402 Handler: Ready\n');

  // Step 6: Create agents
  console.log('🤖 Step 6: Creating AI Agents...');
  const manager = new AgentManager();

  const buyerConfig: AgentConfig = {
    name: 'buyer-agent',
    type: 'autonomous',
    wallet: buyerWallet.getPublicKey(),
    capabilities: ['negotiate_price', 'execute_payment'],
    rules: {
      maxTransaction: 10,
      requireApprovalAbove: 5,
    },
  };

  const sellerConfig: AgentConfig = {
    name: 'seller-agent',
    type: 'service-provider',
    wallet: sellerWallet.getPublicKey(),
    capabilities: ['evaluate_service'],
    rules: {
      maxTransaction: 100,
    },
  };

  const buyerAgent = manager.createAgent(buyerConfig);
  const sellerAgent = manager.createAgent(sellerConfig);

  console.log(`  Buyer Agent:  ${buyerAgent.config.name} (${buyerAgent.id.slice(0, 8)})`);
  console.log(`  Seller Agent: ${sellerAgent.config.name} (${sellerAgent.id.slice(0, 8)})\n`);

  // Step 7: Initialize agent protocol
  console.log('📡 Step 7: Initializing Agent Protocol...');
  const protocol = new AgentProtocol(x402);
  console.log('  Protocol: Ready\n');

  // Step 8: Agent-to-agent negotiation
  console.log('💬 Step 8: Starting Agent Negotiation...');
  const initialOffer = 0.001; // 0.001 SOL
  await protocol.startNegotiation(buyerAgent, sellerAgent, initialOffer, 3);
  console.log(`  Initial Offer: ${initialOffer} SOL`);
  console.log(`  Negotiation started!\n`);

  // Step 9: Check messages
  console.log('📬 Step 9: Checking Agent Messages...');
  const sellerMessages = protocol.getMessages(sellerAgent.id);
  console.log(`  Seller has ${sellerMessages.length} message(s)`);

  if (sellerMessages.length > 0) {
    const msg = sellerMessages[0];
    console.log(`    Type: ${msg.type}`);
    console.log(`    From: ${msg.from.slice(0, 8)}...`);
    console.log(`    Payload:`, msg.payload);
  }
  console.log('');

  // Step 10: Create payment request
  console.log('💳 Step 10: Creating Payment Request...');
  const paymentRequest = x402.createPaymentRequest(
    buyerWallet.getPublicKey(),
    sellerWallet.getPublicKey(),
    0.001,
    { service: 'API call', quantity: 100 }
  );

  console.log(`  Payment ID: ${paymentRequest.id}`);
  console.log(`  Amount: ${paymentRequest.amount} ${paymentRequest.currency}`);
  console.log(`  From: ${paymentRequest.from.slice(0, 20)}...`);
  console.log(`  To: ${paymentRequest.to.slice(0, 20)}...\n`);

  // Step 11: Estimate cost
  console.log('💸 Step 11: Estimating Payment Cost...');
  const estimatedCost = await x402.estimatePaymentCost(paymentRequest.amount);
  console.log(`  Estimated Total: ${estimatedCost} SOL (includes gas)\n`);

  // Step 12: Execute payment (commented out - requires funded wallet)
  console.log('⚡ Step 12: Payment Execution (DRY RUN)...');
  console.log('  Note: Actual execution requires funded wallet');
  console.log('  To execute, uncomment the code below:\n');

  /*
  try {
    const response = await x402.executePayment(paymentRequest, buyerWallet);
    console.log(`  Status: ${response.status}`);
    if (response.txHash) {
      console.log(`  Transaction: ${response.txHash}`);
    }
    if (response.error) {
      console.log(`  Error: ${response.error}`);
    }
  } catch (error) {
    console.log(`  Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  */

  console.log('  Payment flow simulated successfully!\n');

  // Step 13: Protocol stats
  console.log('📊 Step 13: Protocol Statistics...');
  const stats = protocol.getStats();
  console.log(`  Total Messages: ${stats.totalMessages}`);
  console.log(`  Messages by Type:`, stats.messagesByType);
  console.log('');

  // Step 14: Export wallet info
  console.log('🔐 Step 14: Wallet Export...');
  const buyerExport = buyerWallet.export(false); // Don't include secret
  console.log(`  Buyer Public Key: ${buyerExport.publicKey}`);
  console.log(`  Wallet Type: ${buyerExport.type}`);
  console.log('  Secret Key: [REDACTED for security]\n');

  console.log('✅ Complete Payment Flow Example Finished!');
  console.log('\n📚 What we demonstrated:');
  console.log('  ✓ Wallet generation and management');
  console.log('  ✓ Solana network connection');
  console.log('  ✓ x402 payment protocol');
  console.log('  ✓ Agent creation and configuration');
  console.log('  ✓ Agent-to-agent messaging');
  console.log('  ✓ Payment negotiation flow');
  console.log('  ✓ Transaction estimation');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { main };
