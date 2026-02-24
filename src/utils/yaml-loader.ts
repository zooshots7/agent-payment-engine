import { readFileSync, readdirSync } from 'fs';
import { parse } from 'yaml';
import { AgentConfigSchema, type AgentConfig } from '../types/agent.js';
import { resolve } from 'path';

/**
 * YAML Agent Config Loader
 * Load and validate agent configurations from YAML files
 */

export class YAMLLoader {
  /**
   * Load agent config from YAML file
   */
  static loadAgentConfig(filePath: string): AgentConfig {
    try {
      const absolutePath = resolve(filePath);
      const fileContent = readFileSync(absolutePath, 'utf-8');
      const rawConfig = parse(fileContent);

      // Validate against schema
      const validatedConfig = AgentConfigSchema.parse(rawConfig);
      return validatedConfig;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load agent config from ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Load multiple agent configs from directory
   */
  static loadAgentConfigsFromDir(dirPath: string): AgentConfig[] {
    const absolutePath = resolve(dirPath);

    try {
      const files = readdirSync(absolutePath).filter((file: string) =>
        file.endsWith('.yaml') || file.endsWith('.yml')
      );

      return files.map((file: string) => {
        const fullPath = resolve(absolutePath, file);
        return this.loadAgentConfig(fullPath);
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load configs from directory ${dirPath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Parse YAML string to AgentConfig
   */
  static parseYAML(yamlString: string): AgentConfig {
    try {
      const rawConfig = parse(yamlString);
      return AgentConfigSchema.parse(rawConfig);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse YAML: ${error.message}`);
      }
      throw error;
    }
  }
}
