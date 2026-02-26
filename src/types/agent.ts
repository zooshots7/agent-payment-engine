import { z } from 'zod';

/**
 * Agent Types - Core type definitions for AI agents
 */

export const AgentCapabilitySchema = z.enum([
  'negotiate_price',
  'evaluate_service',
  'execute_payment',
  'optimize_yield',
  'detect_fraud',
  'route_optimize',
]);

export type AgentCapability = z.infer<typeof AgentCapabilitySchema>;

export const AgentTypeSchema = z.enum([
  'autonomous',
  'service-provider',
  'validator',
  'optimizer',
  'risk-assessor',
]);

export type AgentType = z.infer<typeof AgentTypeSchema>;

export const AgentConfigSchema = z.object({
  name: z.string().min(1),
  type: AgentTypeSchema,
  wallet: z.string().optional(),
  capabilities: z.array(AgentCapabilitySchema),
  rules: z.object({
    maxTransaction: z.number().positive(),
    requireApprovalAbove: z.number().positive().optional(),
    allowedChains: z.array(z.string()).optional(),
  }),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

export interface Agent {
  id: string;
  config: AgentConfig;
  status: 'active' | 'paused' | 'stopped';
  createdAt: Date;
  lastActive: Date;
}

export interface AgentMessage {
  from: string;
  to: string;
  type: 'payment_request' | 'payment_response' | 'negotiation' | 'status' | 'approval_request';
  payload: unknown;
  timestamp: Date;
}
