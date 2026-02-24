/**
 * Agent Payment Engine
 * Autonomous AI agent orchestration for payment systems
 */

// Agent Management
export { AgentRegistry } from './agents/registry.js';
export { AgentManager } from './agents/manager.js';
export { AgentProtocol } from './agents/protocol.js';
export { YAMLLoader } from './utils/yaml-loader.js';

// Core Payment Infrastructure
export { AgentWallet, MultiSigWallet } from './core/wallet.js';
export { SolanaManager } from './core/solana.js';
export { X402PaymentHandler } from './core/x402.js';

// Strategy & Optimization
export { YieldOptimizer } from './strategy/yield-optimizer.js';
export type {
  Protocol,
  YieldStrategy,
  ProtocolPosition,
  YieldReport
} from './strategy/yield-optimizer.js';

export { RouteOptimizer } from './strategy/route-optimizer.js';
export type {
  ChainId,
  Chain,
  Bridge,
  RouteHop,
  RouteResult,
  RouteConfig,
  GasPrice,
  LiquidityPool
} from './strategy/route-optimizer.js';

// ML & Fraud Detection
export { FraudDetector } from './ml/fraud-detector.js';
export type {
  Transaction,
  GeoLocation,
  UserProfile,
  FraudSignal,
  FraudAnalysis,
  FraudConfig,
  FraudModel,
  FraudActions,
  FraudThresholds
} from './ml/fraud-detector.js';

// Type exports
export * from './types/agent.js';
export * from './types/payment.js';
