import { Agent, AgentConfig } from '../types/agent.js';
import { randomUUID } from 'crypto';

/**
 * Agent Registry - Manages agent lifecycle and discovery
 */

export class AgentRegistry {
  private agents: Map<string, Agent> = new Map();

  /**
   * Register a new agent
   */
  register(config: AgentConfig): Agent {
    const agent: Agent = {
      id: randomUUID(),
      config,
      status: 'active',
      createdAt: new Date(),
      lastActive: new Date(),
    };

    this.agents.set(agent.id, agent);
    console.warn(`[Registry] Agent registered: ${agent.id} (${config.name})`);
    return agent;
  }

  /**
   * Get agent by ID
   */
  get(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  /**
   * Get agent by name
   */
  getByName(name: string): Agent | undefined {
    return Array.from(this.agents.values()).find((agent) => agent.config.name === name);
  }

  /**
   * List all agents
   */
  list(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * List agents by type
   */
  listByType(type: AgentConfig['type']): Agent[] {
    return Array.from(this.agents.values()).filter((agent) => agent.config.type === type);
  }

  /**
   * Update agent status
   */
  updateStatus(id: string, status: Agent['status']): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    agent.status = status;
    agent.lastActive = new Date();
    console.warn(`[Registry] Agent ${id} status updated: ${status}`);
    return true;
  }

  /**
   * Remove agent
   */
  remove(id: string): boolean {
    const removed = this.agents.delete(id);
    if (removed) {
      console.warn(`[Registry] Agent removed: ${id}`);
    }
    return removed;
  }

  /**
   * Find agents with specific capability
   */
  findByCapability(capability: AgentConfig['capabilities'][number]): Agent[] {
    return Array.from(this.agents.values()).filter((agent) =>
      agent.config.capabilities.includes(capability)
    );
  }

  /**
   * Get registry stats
   */
  getStats(): {
    total: number;
    active: number;
    paused: number;
    stopped: number;
  } {
    const agents = Array.from(this.agents.values());
    return {
      total: agents.length,
      active: agents.filter((a) => a.status === 'active').length,
      paused: agents.filter((a) => a.status === 'paused').length,
      stopped: agents.filter((a) => a.status === 'stopped').length,
    };
  }
}
