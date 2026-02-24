import { describe, it, expect, beforeEach } from 'vitest';
import { AgentManager } from '../src/agents/manager.js';
import type { AgentConfig } from '../src/types/agent.js';

describe('AgentManager', () => {
  let manager: AgentManager;

  beforeEach(() => {
    manager = new AgentManager();
  });

  it('should create agent from config object', () => {
    const config: AgentConfig = {
      name: 'test-agent',
      type: 'autonomous',
      capabilities: ['execute_payment'],
      rules: {
        maxTransaction: 100,
      },
    };

    const agent = manager.createAgent(config);

    expect(agent.id).toBeDefined();
    expect(agent.config.name).toBe('test-agent');
    expect(agent.status).toBe('active');
  });

  it('should load template by name', () => {
    const agent = manager.loadTemplate('yield-optimizer');

    expect(agent.config.name).toBe('yield-optimizer');
    expect(agent.config.type).toBe('optimizer');
    expect(agent.config.capabilities).toContain('optimize_yield');
  });

  it('should load all templates', () => {
    const agents = manager.loadAllTemplates();

    expect(agents.length).toBeGreaterThanOrEqual(3);
    const names = agents.map((a) => a.config.name);
    expect(names).toContain('yield-optimizer');
    expect(names).toContain('fraud-detector');
    expect(names).toContain('price-negotiator');
  });

  it('should get agent by name', () => {
    manager.loadTemplate('yield-optimizer');
    const agent = manager.getAgentByName('yield-optimizer');

    expect(agent).toBeDefined();
    expect(agent?.config.name).toBe('yield-optimizer');
  });

  it('should list all agents', () => {
    manager.loadTemplate('yield-optimizer');
    manager.loadTemplate('fraud-detector');

    const agents = manager.listAgents();
    expect(agents.length).toBeGreaterThanOrEqual(2);
  });

  it('should start/pause/stop agents', () => {
    const agent = manager.loadTemplate('yield-optimizer');

    // Pause
    const paused = manager.pauseAgent(agent.id);
    expect(paused).toBe(true);
    expect(manager.getAgent(agent.id)?.status).toBe('paused');

    // Resume
    const started = manager.startAgent(agent.id);
    expect(started).toBe(true);
    expect(manager.getAgent(agent.id)?.status).toBe('active');

    // Stop
    const stopped = manager.stopAgent(agent.id);
    expect(stopped).toBe(true);
    expect(manager.getAgent(agent.id)?.status).toBe('stopped');
  });

  it('should remove agent', () => {
    const agent = manager.loadTemplate('yield-optimizer');
    const removed = manager.removeAgent(agent.id);

    expect(removed).toBe(true);
    expect(manager.getAgent(agent.id)).toBeUndefined();
  });

  it('should provide detailed stats', () => {
    manager.loadTemplate('yield-optimizer');
    manager.loadTemplate('fraud-detector');
    manager.loadTemplate('price-negotiator');

    const stats = manager.getStats();

    expect(stats.total).toBeGreaterThanOrEqual(3);
    expect(stats.active).toBeGreaterThanOrEqual(3);
    expect(stats.byType).toBeDefined();
    expect(stats.byType['optimizer']).toBeGreaterThanOrEqual(1);
    expect(stats.byType['risk-assessor']).toBeGreaterThanOrEqual(1);
    expect(stats.byType['autonomous']).toBeGreaterThanOrEqual(1);
  });

  it('should handle non-existent template gracefully', () => {
    expect(() => manager.loadTemplate('non-existent')).toThrow();
  });

  it('should load custom agents if directory exists', () => {
    // This will return empty array if custom directory doesn't exist
    const customAgents = manager.loadCustomAgents();
    expect(Array.isArray(customAgents)).toBe(true);
  });
});
