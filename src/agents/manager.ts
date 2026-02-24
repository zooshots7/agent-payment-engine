import { AgentRegistry } from './registry.js';
import { YAMLLoader } from '../utils/yaml-loader.js';
import type { Agent, AgentConfig } from '../types/agent.js';
import { resolve } from 'path';

/**
 * Agent Manager
 * High-level agent lifecycle management with template loading
 */

export class AgentManager {
  private registry: AgentRegistry;

  constructor() {
    this.registry = new AgentRegistry();
  }

  /**
   * Create agent from config object
   */
  createAgent(config: AgentConfig): Agent {
    return this.registry.register(config);
  }

  /**
   * Create agent from YAML file
   */
  createAgentFromFile(filePath: string): Agent {
    const config = YAMLLoader.loadAgentConfig(filePath);
    return this.registry.register(config);
  }

  /**
   * Load template agent by name
   */
  loadTemplate(templateName: string): Agent {
    const templatePath = resolve(
      process.cwd(),
      'agents',
      'templates',
      `${templateName}.yaml`
    );
    return this.createAgentFromFile(templatePath);
  }

  /**
   * Load all template agents
   */
  loadAllTemplates(): Agent[] {
    const templatesDir = resolve(process.cwd(), 'agents', 'templates');
    const configs = YAMLLoader.loadAgentConfigsFromDir(templatesDir);
    return configs.map((config) => this.registry.register(config));
  }

  /**
   * Load custom agent configs from user directory
   */
  loadCustomAgents(): Agent[] {
    const customDir = resolve(process.cwd(), 'agents', 'custom');
    try {
      const configs = YAMLLoader.loadAgentConfigsFromDir(customDir);
      return configs.map((config) => this.registry.register(config));
    } catch {
      // Custom directory might not exist or be empty
      return [];
    }
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): Agent | undefined {
    return this.registry.get(id);
  }

  /**
   * Get agent by name
   */
  getAgentByName(name: string): Agent | undefined {
    return this.registry.getByName(name);
  }

  /**
   * List all agents
   */
  listAgents(): Agent[] {
    return this.registry.list();
  }

  /**
   * Start agent (set to active)
   */
  startAgent(id: string): boolean {
    return this.registry.updateStatus(id, 'active');
  }

  /**
   * Pause agent
   */
  pauseAgent(id: string): boolean {
    return this.registry.updateStatus(id, 'paused');
  }

  /**
   * Stop agent
   */
  stopAgent(id: string): boolean {
    return this.registry.updateStatus(id, 'stopped');
  }

  /**
   * Remove agent
   */
  removeAgent(id: string): boolean {
    return this.registry.remove(id);
  }

  /**
   * Get manager statistics
   */
  getStats(): {
    total: number;
    active: number;
    paused: number;
    stopped: number;
    byType: Record<string, number>;
  } {
    const baseStats = this.registry.getStats();
    const agents = this.registry.list();

    // Count by type
    const byType: Record<string, number> = {};
    agents.forEach((agent) => {
      const type = agent.config.type;
      byType[type] = (byType[type] || 0) + 1;
    });

    return {
      ...baseStats,
      byType,
    };
  }
}
