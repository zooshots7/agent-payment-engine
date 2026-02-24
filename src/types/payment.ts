import { z } from 'zod';

/**
 * Payment Types - x402 protocol integration
 */

export const ChainSchema = z.enum(['solana', 'base', 'ethereum', 'arbitrum', 'optimism']);
export type Chain = z.infer<typeof ChainSchema>;

export const PaymentStatusSchema = z.enum([
  'pending',
  'processing',
  'confirmed',
  'failed',
  'refunded',
]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export interface PaymentRequest {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  chain: Chain;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface PaymentResponse {
  requestId: string;
  status: PaymentStatus;
  txHash?: string;
  blockNumber?: number;
  timestamp: Date;
  error?: string;
}

export interface RouteOptimization {
  sourceChain: Chain;
  targetChain: Chain;
  amount: number;
  routes: PaymentRoute[];
  recommended: PaymentRoute;
}

export interface PaymentRoute {
  path: Chain[];
  estimatedCost: number;
  estimatedTime: number;
  bridges: string[];
  score: number;
}

export const YieldStrategySchema = z.enum(['conservative', 'balanced', 'aggressive']);
export type YieldStrategy = z.infer<typeof YieldStrategySchema>;

export interface YieldProtocol {
  name: string;
  chain: Chain;
  apy: number;
  tvl: number;
  riskLevel: 'low' | 'medium' | 'high';
  weight?: number;
}

export interface YieldOptimizationConfig {
  enabled: boolean;
  strategy: YieldStrategy;
  minBalanceThreshold: number;
  protocols: YieldProtocol[];
  rebalanceFrequency: string;
  emergencyReserve: number;
}
