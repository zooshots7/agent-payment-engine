/**
 * Example: Loading and Managing Agent Templates
 * 
 * This example demonstrates how to:
 * 1. Load pre-built agent templates
 * 2. Manage agent lifecycle
 * 3. Query agent capabilities
 */

import { AgentManager } from '../src/agents/manager.js';

async function main(): Promise<void> {
  console.log('🤖 Agent Payment Engine - Template Loading Example\n');

  // Create agent manager
  const manager = new AgentManager();

  // Load individual template
  console.log('📦 Loading yield optimizer template...');
  const yieldAgent = manager.loadTemplate('yield-optimizer');
  console.log(`✅ Loaded: ${yieldAgent.config.name} (${yieldAgent.id})\n`);

  // Load all templates
  console.log('📦 Loading all templates...');
  const allTemplates = manager.loadAllTemplates();
  console.log(`✅ Loaded ${allTemplates.length} templates:\n`);

  allTemplates.forEach((agent) => {
    console.log(`  - ${agent.config.name} (${agent.config.type})`);
    console.log(`    Capabilities: ${agent.config.capabilities.join(', ')}`);
    console.log(`    Max Transaction: $${agent.config.rules.maxTransaction}`);
    console.log('');
  });

  // Get statistics
  console.log('📊 Manager Statistics:');
  const stats = manager.getStats();
  console.log(`  Total Agents: ${stats.total}`);
  console.log(`  Active: ${stats.active}`);
  console.log(`  Paused: ${stats.paused}`);
  console.log(`  Stopped: ${stats.stopped}`);
  console.log('\n  By Type:');
  Object.entries(stats.byType).forEach(([type, count]) => {
    console.log(`    ${type}: ${count}`);
  });
  console.log('');

  // Query specific agent
  console.log('🔍 Querying fraud detector...');
  const fraudAgent = manager.getAgentByName('fraud-detector');
  if (fraudAgent) {
    console.log(`✅ Found: ${fraudAgent.config.name}`);
    console.log(`   Type: ${fraudAgent.config.type}`);
    console.log(`   Status: ${fraudAgent.status}`);
    console.log(`   Capabilities: ${fraudAgent.config.capabilities.join(', ')}\n`);
  }

  // Manage agent lifecycle
  console.log('🔄 Managing agent lifecycle...');
  if (fraudAgent) {
    console.log(`  Pausing ${fraudAgent.config.name}...`);
    manager.pauseAgent(fraudAgent.id);
    console.log(`  Status: ${manager.getAgent(fraudAgent.id)?.status}`);

    console.log(`  Resuming ${fraudAgent.config.name}...`);
    manager.startAgent(fraudAgent.id);
    console.log(`  Status: ${manager.getAgent(fraudAgent.id)?.status}\n`);
  }

  // List all active agents
  console.log('✨ Active Agents:');
  const activeAgents = manager
    .listAgents()
    .filter((agent) => agent.status === 'active');

  activeAgents.forEach((agent) => {
    console.log(`  - ${agent.config.name} (${agent.config.type})`);
  });

  console.log('\n✅ Example completed!');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { main };
