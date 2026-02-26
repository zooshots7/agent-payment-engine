import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Commitment,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { AgentWallet } from './wallet.js';

/**
 * Solana Network Manager
 * Handles RPC connections, balance checking, and transaction submission
 */

export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';

export interface SolanaConfig {
  network: SolanaNetwork;
  rpcUrl?: string;
  commitment?: Commitment;
}

export class SolanaManager {
  private connection: Connection;
  private network: SolanaNetwork;
  private commitment: Commitment;

  constructor(config: SolanaConfig) {
    this.network = config.network;
    this.commitment = config.commitment || 'confirmed';

    // Use custom RPC URL or default cluster URL
    let rpcUrl: string;
    if (config.rpcUrl) {
      rpcUrl = config.rpcUrl;
    } else if (config.network === 'localnet') {
      rpcUrl = 'http://localhost:8899';
    } else {
      rpcUrl = clusterApiUrl(config.network);
    }
    this.connection = new Connection(rpcUrl, this.commitment);
  }

  /**
   * Get Solana connection
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get current network
   */
  getNetwork(): SolanaNetwork {
    return this.network;
  }

  /**
   * Get SOL balance for a wallet
   */
  async getBalance(publicKey: PublicKey): Promise<number> {
    const lamports = await this.connection.getBalance(publicKey);
    return lamports / LAMPORTS_PER_SOL;
  }

  /**
   * Get SPL token balance
   */
  async getTokenBalance(
    walletPublicKey: PublicKey,
    tokenMintAddress: PublicKey
  ): Promise<number> {
    try {
      const { getAssociatedTokenAddress, getAccount } = await import('@solana/spl-token');

      const tokenAccount = await getAssociatedTokenAddress(
        tokenMintAddress,
        walletPublicKey
      );

      const accountInfo = await getAccount(this.connection, tokenAccount);
      return Number(accountInfo.amount);
    } catch (error) {
      // Account doesn't exist or other error
      return 0;
    }
  }

  /**
   * Send and confirm a transaction
   */
  async sendTransaction(
    transaction: Transaction,
    wallet: AgentWallet,
    options?: {
      skipPreflight?: boolean;
      maxRetries?: number;
    }
  ): Promise<string> {
    if (!wallet.canSign()) {
      throw new Error('Wallet cannot sign transactions (cold wallet)');
    }

    try {
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [wallet.getKeypair()],
        {
          commitment: this.commitment,
          skipPreflight: options?.skipPreflight || false,
          maxRetries: options?.maxRetries,
        }
      );

      return signature;
    } catch (error) {
      throw new Error(
        `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get recent blockhash
   */
  async getRecentBlockhash(): Promise<string> {
    const { blockhash } = await this.connection.getLatestBlockhash(this.commitment);
    return blockhash;
  }

  /**
   * Get transaction confirmation
   */
  async confirmTransaction(signature: string): Promise<boolean> {
    try {
      const result = await this.connection.confirmTransaction(signature, this.commitment);
      return !result.value.err;
    } catch {
      return false;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(signature: string): Promise<unknown> {
    const commitment = this.commitment === 'processed' ? 'confirmed' : this.commitment;
    return await this.connection.getTransaction(signature, {
      commitment: commitment as 'confirmed' | 'finalized',
      maxSupportedTransactionVersion: 0,
    });
  }

  /**
   * Request airdrop (devnet/testnet only)
   */
  async requestAirdrop(publicKey: PublicKey, amount: number): Promise<string> {
    if (this.network === 'mainnet-beta') {
      throw new Error('Airdrop not available on mainnet');
    }

    const lamports = amount * LAMPORTS_PER_SOL;
    const signature = await this.connection.requestAirdrop(publicKey, lamports);
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  /**
   * Get network performance stats
   */
  async getPerformanceStats(): Promise<{
    tps: number;
    slotLeader: string;
    epoch: number;
  }> {
    const perfSamples = await this.connection.getRecentPerformanceSamples(1);
    const epochInfo = await this.connection.getEpochInfo();
    const slotLeaders = await this.connection.getSlotLeaders(
      epochInfo.absoluteSlot,
      1
    );

    return {
      tps: perfSamples[0]?.numTransactions || 0,
      slotLeader: slotLeaders[0]?.toBase58() || 'unknown',
      epoch: epochInfo.epoch,
    };
  }

  /**
   * Check if address is valid
   */
  static isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }
}
