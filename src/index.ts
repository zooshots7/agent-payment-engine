/**
 * Agent Payment Engine
 * Autonomous AI agent orchestration for payment systems
 */

export { AgentRegistry } from './agents/registry.js';
export * from './types/agent.js';
export * from './types/payment.js';

// Example usage
import { AgentRegistry } from './agents/registry.js';

const registry = new AgentRegistry();

// Register a sample agent
const agent = registry.register({
  name: 'yield-optimizer-1',
  type: 'optimizer',
  capabilities: ['optimize_yield'],
  rules: {
    maxTransaction: 1000,
    requireApprovalAbove: 500,
  },
});

console.warn('🚀 Agent Payment Engine initialized');
console.warn(`📊 Stats:`, registry.getStats());
console.warn(`🤖 Sample agent:`, agent.id);
