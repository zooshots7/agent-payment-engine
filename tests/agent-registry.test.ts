import { describe, it, expect, beforeEach } from 'vitest';
import { AgentRegistry } from '../src/agents/registry.js';
import type { AgentConfig } from '../src/types/agent.js';

describe('AgentRegistry', () => {
  let registry: AgentRegistry;

  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('should register a new agent', () => {
    const config: AgentConfig = {
      name: 'test-agent',
      type: 'autonomous',
      capabilities: ['execute_payment'],
      rules: {
        maxTransaction: 100,
      },
    };

    const agent = registry.register(config);

    expect(agent.id).toBeDefined();
    expect(agent.config.name).toBe('test-agent');
    expect(agent.status).toBe('active');
  });

  it('should retrieve agent by ID', () => {
    const config: AgentConfig = {
      name: 'test-agent-2',
      type: 'optimizer',
      capabilities: ['optimize_yield'],
      rules: {
        maxTransaction: 500,
      },
    };

    const agent = registry.register(config);
    const retrieved = registry.get(agent.id);

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(agent.id);
  });

  it('should retrieve agent by name', () => {
    const config: AgentConfig = {
      name: 'unique-agent',
      type: 'validator',
      capabilities: ['execute_payment'],
      rules: {
        maxTransaction: 1000,
      },
    };

    registry.register(config);
    const retrieved = registry.getByName('unique-agent');

    expect(retrieved).toBeDefined();
    expect(retrieved?.config.name).toBe('unique-agent');
  });

  it('should list all agents', () => {
    const config1: AgentConfig = {
      name: 'agent-1',
      type: 'autonomous',
      capabilities: ['execute_payment'],
      rules: { maxTransaction: 100 },
    };

    const config2: AgentConfig = {
      name: 'agent-2',
      type: 'optimizer',
      capabilities: ['optimize_yield'],
      rules: { maxTransaction: 200 },
    };

    registry.register(config1);
    registry.register(config2);

    const agents = registry.list();
    expect(agents).toHaveLength(2);
  });

  it('should update agent status', () => {
    const config: AgentConfig = {
      name: 'status-test',
      type: 'autonomous',
      capabilities: ['execute_payment'],
      rules: { maxTransaction: 100 },
    };

    const agent = registry.register(config);
    const updated = registry.updateStatus(agent.id, 'paused');

    expect(updated).toBe(true);
    expect(registry.get(agent.id)?.status).toBe('paused');
  });

  it('should remove agent', () => {
    const config: AgentConfig = {
      name: 'remove-test',
      type: 'autonomous',
      capabilities: ['execute_payment'],
      rules: { maxTransaction: 100 },
    };

    const agent = registry.register(config);
    const removed = registry.remove(agent.id);

    expect(removed).toBe(true);
    expect(registry.get(agent.id)).toBeUndefined();
  });

  it('should find agents by capability', () => {
    const config1: AgentConfig = {
      name: 'executor-1',
      type: 'autonomous',
      capabilities: ['execute_payment', 'negotiate_price'],
      rules: { maxTransaction: 100 },
    };

    const config2: AgentConfig = {
      name: 'executor-2',
      type: 'validator',
      capabilities: ['execute_payment'],
      rules: { maxTransaction: 200 },
    };

    const config3: AgentConfig = {
      name: 'optimizer-1',
      type: 'optimizer',
      capabilities: ['optimize_yield'],
      rules: { maxTransaction: 300 },
    };

    registry.register(config1);
    registry.register(config2);
    registry.register(config3);

    const executors = registry.findByCapability('execute_payment');
    expect(executors).toHaveLength(2);
  });

  it('should provide correct stats', () => {
    const config1: AgentConfig = {
      name: 'stats-1',
      type: 'autonomous',
      capabilities: ['execute_payment'],
      rules: { maxTransaction: 100 },
    };

    const config2: AgentConfig = {
      name: 'stats-2',
      type: 'optimizer',
      capabilities: ['optimize_yield'],
      rules: { maxTransaction: 200 },
    };

    const agent1 = registry.register(config1);
    const agent2 = registry.register(config2);

    registry.updateStatus(agent2.id, 'paused');

    const stats = registry.getStats();

    expect(stats.total).toBe(2);
    expect(stats.active).toBe(1);
    expect(stats.paused).toBe(1);
    expect(stats.stopped).toBe(0);
  });
});
