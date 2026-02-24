import { describe, it, expect } from 'vitest';
import { YAMLLoader } from '../src/utils/yaml-loader.js';
import { resolve } from 'path';

describe('YAMLLoader', () => {
  const templatesDir = resolve(process.cwd(), 'agents', 'templates');

  it('should load yield optimizer template', () => {
    const config = YAMLLoader.loadAgentConfig(
      resolve(templatesDir, 'yield-optimizer.yaml')
    );

    expect(config.name).toBe('yield-optimizer');
    expect(config.type).toBe('optimizer');
    expect(config.capabilities).toContain('optimize_yield');
    expect(config.rules.maxTransaction).toBe(10000);
  });

  it('should load fraud detector template', () => {
    const config = YAMLLoader.loadAgentConfig(
      resolve(templatesDir, 'fraud-detector.yaml')
    );

    expect(config.name).toBe('fraud-detector');
    expect(config.type).toBe('risk-assessor');
    expect(config.capabilities).toContain('detect_fraud');
  });

  it('should load price negotiator template', () => {
    const config = YAMLLoader.loadAgentConfig(
      resolve(templatesDir, 'price-negotiator.yaml')
    );

    expect(config.name).toBe('price-negotiator');
    expect(config.type).toBe('autonomous');
    expect(config.capabilities).toContain('negotiate_price');
    expect(config.rules.maxTransaction).toBe(5000);
  });

  it('should load all templates from directory', () => {
    const configs = YAMLLoader.loadAgentConfigsFromDir(templatesDir);

    expect(configs.length).toBeGreaterThanOrEqual(3);
    expect(configs.map((c) => c.name)).toContain('yield-optimizer');
    expect(configs.map((c) => c.name)).toContain('fraud-detector');
    expect(configs.map((c) => c.name)).toContain('price-negotiator');
  });

  it('should parse YAML string', () => {
    const yamlString = `
name: test-agent
type: autonomous
capabilities:
  - execute_payment
rules:
  maxTransaction: 500
`;

    const config = YAMLLoader.parseYAML(yamlString);

    expect(config.name).toBe('test-agent');
    expect(config.type).toBe('autonomous');
    expect(config.capabilities).toContain('execute_payment');
  });

  it('should throw error for invalid YAML', () => {
    const invalidYaml = `
name: test
type: invalid-type
capabilities:
  - invalid-capability
rules:
  maxTransaction: -100
`;

    expect(() => YAMLLoader.parseYAML(invalidYaml)).toThrow();
  });

  it('should throw error for missing required fields', () => {
    const incompleteYaml = `
name: test-agent
type: autonomous
`;

    expect(() => YAMLLoader.parseYAML(incompleteYaml)).toThrow();
  });
});
