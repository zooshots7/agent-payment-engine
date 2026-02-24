/**
 * Route Optimization Engine
 * 
 * Finds the optimal path for cross-chain payments by analyzing:
 * - Bridge costs and fees
 * - Gas prices across chains
 * - Liquidity depth
 * - Execution time
 * - Slippage tolerance
 */

import { Connection, PublicKey } from '@solana/web3.js';

export type ChainId = 'solana' | 'base' | 'ethereum' | 'arbitrum' | 'polygon' | 'optimism';

export interface Chain {
  id: ChainId;
  name: string;
  nativeToken: string;
  rpcUrl: string;
  chainIdHex: string;
}

export interface Bridge {
  name: string;
  supportedChains: ChainId[];
  baseFee: number; // USD
  feePercentage: number; // 0-100
  averageTime: number; // seconds
  maxSlippage: number; // percentage
  minAmount: number; // USD
  maxAmount: number; // USD
}

export interface RouteHop {
  fromChain: ChainId;
  toChain: ChainId;
  bridge: string;
  amount: number;
  estimatedCost: number;
  estimatedTime: number;
  gasEstimate: number;
}

export interface RouteResult {
  path: RouteHop[];
  totalCost: number;
  totalTime: number;
  totalHops: number;
  successProbability: number;
  recommendation: string;
}

export interface RouteConfig {
  enabled: boolean;
  chains: ChainId[];
  optimizeFor: 'cost' | 'speed' | 'balance';
  maxHops: number;
  slippageTolerance: number;
  bridges: string[];
  gasMultiplier: number; // For gas price uncertainty
}

export interface GasPrice {
  chain: ChainId;
  standard: number; // gwei
  fast: number;
  instant: number;
  lastUpdated: Date;
}

export interface LiquidityPool {
  bridge: string;
  fromChain: ChainId;
  toChain: ChainId;
  liquidity: number; // USD
  volume24h: number;
  lastUpdated: Date;
}

export class RouteOptimizer {
  private chains: Map<ChainId, Chain> = new Map();
  private bridges: Map<string, Bridge> = new Map();
  private gasPrices: Map<ChainId, GasPrice> = new Map();
  private liquidityPools: Map<string, LiquidityPool> = new Map();
  private config: RouteConfig;

  constructor(config: RouteConfig) {
    this.config = config;
    this.initializeChains();
    this.initializeBridges();
  }

  /**
   * Initialize supported chains
   */
  private initializeChains(): void {
    const chains: Chain[] = [
      {
        id: 'solana',
        name: 'Solana',
        nativeToken: 'SOL',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        chainIdHex: '0x1'
      },
      {
        id: 'base',
        name: 'Base',
        nativeToken: 'ETH',
        rpcUrl: 'https://mainnet.base.org',
        chainIdHex: '0x2105'
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        nativeToken: 'ETH',
        rpcUrl: 'https://eth.llamarpc.com',
        chainIdHex: '0x1'
      },
      {
        id: 'arbitrum',
        name: 'Arbitrum',
        nativeToken: 'ETH',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        chainIdHex: '0xa4b1'
      },
      {
        id: 'polygon',
        name: 'Polygon',
        nativeToken: 'MATIC',
        rpcUrl: 'https://polygon-rpc.com',
        chainIdHex: '0x89'
      },
      {
        id: 'optimism',
        name: 'Optimism',
        nativeToken: 'ETH',
        rpcUrl: 'https://mainnet.optimism.io',
        chainIdHex: '0xa'
      }
    ];

    chains.forEach(chain => {
      if (this.config.chains.includes(chain.id)) {
        this.chains.set(chain.id, chain);
      }
    });
  }

  /**
   * Initialize supported bridges
   */
  private initializeBridges(): void {
    const bridges: Bridge[] = [
      {
        name: 'Wormhole',
        supportedChains: ['solana', 'ethereum', 'base', 'arbitrum', 'polygon', 'optimism'],
        baseFee: 5,
        feePercentage: 0.1,
        averageTime: 180, // 3 minutes
        maxSlippage: 0.5,
        minAmount: 50,
        maxAmount: 1_000_000
      },
      {
        name: 'Mayan',
        supportedChains: ['solana', 'ethereum', 'base', 'arbitrum', 'polygon'],
        baseFee: 3,
        feePercentage: 0.15,
        averageTime: 120, // 2 minutes
        maxSlippage: 1.0,
        minAmount: 20,
        maxAmount: 500_000
      },
      {
        name: 'Allbridge',
        supportedChains: ['solana', 'ethereum', 'base', 'polygon'],
        baseFee: 2,
        feePercentage: 0.2,
        averageTime: 240, // 4 minutes
        maxSlippage: 0.8,
        minAmount: 10,
        maxAmount: 250_000
      },
      {
        name: 'Stargate',
        supportedChains: ['ethereum', 'arbitrum', 'optimism', 'polygon', 'base'],
        baseFee: 4,
        feePercentage: 0.06,
        averageTime: 60, // 1 minute
        maxSlippage: 0.3,
        minAmount: 100,
        maxAmount: 5_000_000
      },
      {
        name: 'Hop',
        supportedChains: ['ethereum', 'arbitrum', 'optimism', 'polygon'],
        baseFee: 3,
        feePercentage: 0.04,
        averageTime: 45, // 45 seconds
        maxSlippage: 0.2,
        minAmount: 50,
        maxAmount: 1_000_000
      }
    ];

    bridges.forEach(bridge => {
      if (this.config.bridges.includes(bridge.name)) {
        this.bridges.set(bridge.name, bridge);
      }
    });
  }

  /**
   * Find optimal route between two chains
   */
  async findOptimalRoute(
    fromChain: ChainId,
    toChain: ChainId,
    amount: number
  ): Promise<RouteResult> {
    console.log(`🔍 Finding optimal route: ${fromChain} → ${toChain} (${amount} USDC)`);

    // Validate chains
    if (!this.chains.has(fromChain) || !this.chains.has(toChain)) {
      throw new Error(`Unsupported chain: ${fromChain} or ${toChain}`);
    }

    // If same chain, no route needed
    if (fromChain === toChain) {
      return {
        path: [],
        totalCost: 0,
        totalTime: 0,
        totalHops: 0,
        successProbability: 1.0,
        recommendation: 'Same chain - no bridge needed'
      };
    }

    // Fetch latest data
    await this.updateGasPrices();
    await this.updateLiquidityPools();

    // Find all possible routes
    const routes = await this.findAllRoutes(fromChain, toChain, amount);

    if (routes.length === 0) {
      throw new Error(`No route found from ${fromChain} to ${toChain}`);
    }

    // Select best route based on optimization strategy
    const bestRoute = this.selectBestRoute(routes);

    console.log(`✅ Found optimal route with ${bestRoute.totalHops} hop(s)`);
    console.log(`💰 Total cost: $${bestRoute.totalCost.toFixed(2)}`);
    console.log(`⏱️  Estimated time: ${bestRoute.totalTime}s`);

    return bestRoute;
  }

  /**
   * Find all possible routes (with max hops constraint)
   */
  private async findAllRoutes(
    fromChain: ChainId,
    toChain: ChainId,
    amount: number,
    visited: Set<ChainId> = new Set(),
    currentPath: RouteHop[] = []
  ): Promise<RouteResult[]> {
    // Max hops reached
    if (currentPath.length >= this.config.maxHops) {
      return [];
    }

    // Mark current chain as visited
    visited.add(fromChain);

    const routes: RouteResult[] = [];

    // Try direct bridges
    for (const [bridgeName, bridge] of this.bridges.entries()) {
      // Check if bridge supports both chains
      if (!bridge.supportedChains.includes(fromChain) || 
          !bridge.supportedChains.includes(toChain)) {
        continue;
      }

      // Check amount constraints
      if (amount < bridge.minAmount || amount > bridge.maxAmount) {
        continue;
      }

      // Calculate hop cost and time
      const hop = await this.calculateHop(
        fromChain,
        toChain,
        bridgeName,
        amount
      );

      const route: RouteResult = {
        path: [...currentPath, hop],
        totalCost: currentPath.reduce((sum, h) => sum + h.estimatedCost, 0) + hop.estimatedCost,
        totalTime: currentPath.reduce((sum, h) => sum + h.estimatedTime, 0) + hop.estimatedTime,
        totalHops: currentPath.length + 1,
        successProbability: this.calculateSuccessProbability([...currentPath, hop]),
        recommendation: this.generateRecommendation([...currentPath, hop])
      };

      routes.push(route);
    }

    // Try multi-hop routes (if enabled and beneficial)
    if (currentPath.length < this.config.maxHops - 1) {
      for (const intermediateChain of this.config.chains) {
        // Skip if already visited or same as source/destination
        if (visited.has(intermediateChain) || 
            intermediateChain === fromChain || 
            intermediateChain === toChain) {
          continue;
        }

        // Find bridges to intermediate chain
        for (const [bridgeName, bridge] of this.bridges.entries()) {
          if (!bridge.supportedChains.includes(fromChain) || 
              !bridge.supportedChains.includes(intermediateChain)) {
            continue;
          }

          if (amount < bridge.minAmount || amount > bridge.maxAmount) {
            continue;
          }

          // Calculate hop to intermediate chain
          const hop = await this.calculateHop(
            fromChain,
            intermediateChain,
            bridgeName,
            amount
          );

          // Recursively find routes from intermediate to destination
          const remainingAmount = amount - hop.estimatedCost;
          const subRoutes = await this.findAllRoutes(
            intermediateChain,
            toChain,
            remainingAmount,
            new Set(visited),
            [...currentPath, hop]
          );

          routes.push(...subRoutes);
        }
      }
    }

    return routes;
  }

  /**
   * Calculate hop details (cost, time, gas)
   */
  private async calculateHop(
    fromChain: ChainId,
    toChain: ChainId,
    bridgeName: string,
    amount: number
  ): Promise<RouteHop> {
    const bridge = this.bridges.get(bridgeName)!;
    
    // Calculate bridge fee
    const bridgeFee = bridge.baseFee + (amount * bridge.feePercentage / 100);

    // Estimate gas costs
    const fromGas = await this.estimateGasCost(fromChain, 'bridge_out');
    const toGas = await this.estimateGasCost(toChain, 'bridge_in');
    const totalGas = fromGas + toGas;

    // Total cost
    const totalCost = bridgeFee + totalGas;

    return {
      fromChain,
      toChain,
      bridge: bridgeName,
      amount,
      estimatedCost: totalCost,
      estimatedTime: bridge.averageTime,
      gasEstimate: totalGas
    };
  }

  /**
   * Estimate gas cost for a transaction
   */
  private async estimateGasCost(
    chain: ChainId,
    txType: 'bridge_out' | 'bridge_in'
  ): Promise<number> {
    const gasPrice = this.gasPrices.get(chain);
    
    if (!gasPrice) {
      // Default fallback gas prices
      return chain === 'solana' ? 0.0001 : 5; // $0.0001 for Solana, $5 for EVM
    }

    // Estimate gas units needed
    const gasUnits = txType === 'bridge_out' ? 150_000 : 100_000;

    // Calculate cost based on optimization strategy
    let gwei: number;
    switch (this.config.optimizeFor) {
      case 'speed':
        gwei = gasPrice.instant;
        break;
      case 'cost':
        gwei = gasPrice.standard;
        break;
      case 'balance':
        gwei = gasPrice.fast;
        break;
    }

    // Convert gwei to USD (approximate, chain-specific)
    const ethPrice = 3000; // Mock ETH price
    const gasCost = (gasUnits * gwei * 1e-9 * ethPrice);

    return gasCost * this.config.gasMultiplier;
  }

  /**
   * Update gas prices for all chains
   */
  private async updateGasPrices(): Promise<void> {
    // In production, fetch from chain RPCs or gas price APIs
    // Mock data for now
    
    const mockGasPrices: Record<ChainId, Partial<GasPrice>> = {
      solana: { standard: 0.000005, fast: 0.00001, instant: 0.00002 },
      ethereum: { standard: 30, fast: 50, instant: 100 },
      base: { standard: 0.5, fast: 1, instant: 2 },
      arbitrum: { standard: 0.3, fast: 0.6, instant: 1.2 },
      polygon: { standard: 50, fast: 100, instant: 200 },
      optimism: { standard: 0.4, fast: 0.8, instant: 1.5 }
    };

    for (const [chainId, prices] of Object.entries(mockGasPrices)) {
      if (this.chains.has(chainId as ChainId)) {
        this.gasPrices.set(chainId as ChainId, {
          chain: chainId as ChainId,
          standard: prices.standard!,
          fast: prices.fast!,
          instant: prices.instant!,
          lastUpdated: new Date()
        });
      }
    }
  }

  /**
   * Update liquidity pool data
   */
  private async updateLiquidityPools(): Promise<void> {
    // In production, fetch from bridge APIs
    // Mock data for now
    
    // This would populate liquidityPools map with real-time liquidity data
    // Used to filter out routes with insufficient liquidity
  }

  /**
   * Select best route based on optimization strategy
   */
  private selectBestRoute(routes: RouteResult[]): RouteResult {
    if (routes.length === 0) {
      throw new Error('No routes available');
    }

    let bestRoute = routes[0];

    for (const route of routes) {
      switch (this.config.optimizeFor) {
        case 'cost':
          if (route.totalCost < bestRoute.totalCost) {
            bestRoute = route;
          }
          break;

        case 'speed':
          if (route.totalTime < bestRoute.totalTime) {
            bestRoute = route;
          }
          break;

        case 'balance':
          // Balanced score: normalize cost and time, then combine
          const currentScore = this.calculateBalancedScore(bestRoute);
          const routeScore = this.calculateBalancedScore(route);
          
          if (routeScore > currentScore) {
            bestRoute = route;
          }
          break;
      }
    }

    return bestRoute;
  }

  /**
   * Calculate balanced score (higher is better)
   */
  private calculateBalancedScore(route: RouteResult): number {
    // Normalize cost (lower is better, so invert)
    const maxCost = 100; // Assume max reasonable cost
    const costScore = 1 - (route.totalCost / maxCost);

    // Normalize time (lower is better, so invert)
    const maxTime = 600; // 10 minutes max reasonable
    const timeScore = 1 - (route.totalTime / maxTime);

    // Success probability (higher is better)
    const probabilityScore = route.successProbability;

    // Weighted combination (40% cost, 30% time, 30% reliability)
    return (costScore * 0.4) + (timeScore * 0.3) + (probabilityScore * 0.3);
  }

  /**
   * Calculate success probability for a route
   */
  private calculateSuccessProbability(path: RouteHop[]): number {
    // Start with base probability
    let probability = 1.0;

    // Each hop reduces probability slightly
    const hopPenalty = 0.05; // 5% penalty per hop
    probability -= (path.length - 1) * hopPenalty;

    // Bridge reliability factors
    const bridgeReliability: Record<string, number> = {
      'Wormhole': 0.98,
      'Mayan': 0.96,
      'Allbridge': 0.94,
      'Stargate': 0.99,
      'Hop': 0.97
    };

    for (const hop of path) {
      const reliability = bridgeReliability[hop.bridge] || 0.95;
      probability *= reliability;
    }

    return Math.max(0, Math.min(1, probability));
  }

  /**
   * Generate recommendation text
   */
  private generateRecommendation(path: RouteHop[]): string {
    if (path.length === 0) return 'Direct transfer';
    if (path.length === 1) return 'Single bridge hop - optimal';
    
    return `Multi-hop route via ${path.length} bridge(s) - consider consolidating if possible`;
  }

  /**
   * Get supported chains
   */
  getSupportedChains(): ChainId[] {
    return Array.from(this.chains.keys());
  }

  /**
   * Get supported bridges
   */
  getSupportedBridges(): string[] {
    return Array.from(this.bridges.keys());
  }

  /**
   * Get current gas prices
   */
  getGasPrices(): Map<ChainId, GasPrice> {
    return new Map(this.gasPrices);
  }
}
