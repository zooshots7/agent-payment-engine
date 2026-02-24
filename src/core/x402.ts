import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import type { PaymentRequest, PaymentResponse, PaymentStatus, Chain } from '../types/payment.js';
import { SolanaManager } from './solana.js';
import { AgentWallet } from './wallet.js';
import { randomUUID } from 'crypto';

/**
 * x402 Payment Protocol Handler
 * HTTP 402 Payment Required - for AI agent micropayments
 */

export interface X402Config {
  facilitatorUrl?: string;
  defaultCurrency: string;
  defaultChain: Chain;
}

export class X402PaymentHandler {
  private solana: SolanaManager;
  private config: X402Config;

  constructor(solana: SolanaManager, config: X402Config) {
    this.solana = solana;
    this.config = config;
  }

  /**
   * Create a payment request
   */
  createPaymentRequest(
    from: string,
    to: string,
    amount: number,
    metadata?: Record<string, unknown>
  ): PaymentRequest {
    return {
      id: randomUUID(),
      from,
      to,
      amount,
      currency: this.config.defaultCurrency,
      chain: this.config.defaultChain,
      metadata,
      createdAt: new Date(),
    };
  }

  /**
   * Execute a payment on Solana
   */
  async executePayment(
    request: PaymentRequest,
    wallet: AgentWallet
  ): Promise<PaymentResponse> {
    const response: PaymentResponse = {
      requestId: request.id,
      status: 'pending' as PaymentStatus,
      timestamp: new Date(),
    };

    try {
      // Validate addresses
      if (!SolanaManager.isValidAddress(request.to)) {
        throw new Error('Invalid recipient address');
      }

      const toPublicKey = new PublicKey(request.to);
      const fromPublicKey = wallet.publicKey;

      // Convert amount to lamports (assuming USDC or SOL)
      const lamports = Math.floor(request.amount * 1_000_000_000);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      // Get recent blockhash
      const blockhash = await this.solana.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPublicKey;

      // Send transaction
      response.status = 'processing';
      const signature = await this.solana.sendTransaction(transaction, wallet);

      // Confirm transaction
      const confirmed = await this.solana.confirmTransaction(signature);

      if (confirmed) {
        response.status = 'confirmed';
        response.txHash = signature;
      } else {
        response.status = 'failed';
        response.error = 'Transaction confirmation failed';
      }
    } catch (error) {
      response.status = 'failed';
      response.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return response;
  }

  /**
   * Execute SPL token payment (USDC, USDT, etc.)
   */
  async executeTokenPayment(
    request: PaymentRequest,
    wallet: AgentWallet,
    tokenMintAddress: string
  ): Promise<PaymentResponse> {
    const response: PaymentResponse = {
      requestId: request.id,
      status: 'pending',
      timestamp: new Date(),
    };

    try {
      const { createTransferInstruction, getAssociatedTokenAddress } = await import(
        '@solana/spl-token'
      );

      const mintPublicKey = new PublicKey(tokenMintAddress);
      const toPublicKey = new PublicKey(request.to);
      const fromPublicKey = wallet.publicKey;

      // Get associated token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        fromPublicKey
      );

      const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, toPublicKey);

      // Convert amount (assuming 6 decimals for USDC)
      const amount = Math.floor(request.amount * 1_000_000);

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPublicKey,
        amount
      );

      const transaction = new Transaction().add(transferInstruction);

      // Get recent blockhash
      const blockhash = await this.solana.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPublicKey;

      // Send transaction
      response.status = 'processing';
      const signature = await this.solana.sendTransaction(transaction, wallet);

      // Confirm transaction
      const confirmed = await this.solana.confirmTransaction(signature);

      if (confirmed) {
        response.status = 'confirmed';
        response.txHash = signature;
      } else {
        response.status = 'failed';
        response.error = 'Transaction confirmation failed';
      }
    } catch (error) {
      response.status = 'failed';
      response.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return response;
  }

  /**
   * Verify a payment was completed
   */
  async verifyPayment(txHash: string): Promise<boolean> {
    try {
      return await this.solana.confirmTransaction(txHash);
    } catch {
      return false;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(txHash: string): Promise<PaymentStatus> {
    try {
      const confirmed = await this.solana.confirmTransaction(txHash);
      return confirmed ? 'confirmed' : 'failed';
    } catch {
      return 'failed';
    }
  }

  /**
   * Estimate payment cost (gas fees)
   */
  async estimatePaymentCost(amount: number): Promise<number> {
    // Base transaction fee on Solana (typically 5000 lamports = 0.000005 SOL)
    const baseFee = 0.000005;
    return amount + baseFee;
  }

  /**
   * Generate x402 payment headers for HTTP responses
   */
  generatePaymentHeaders(request: PaymentRequest): Record<string, string> {
    return {
      'X-Payment-Required': 'true',
      'X-Payment-Amount': request.amount.toString(),
      'X-Payment-Currency': request.currency,
      'X-Payment-Chain': request.chain,
      'X-Payment-Address': request.to,
      'X-Payment-ID': request.id,
    };
  }

  /**
   * Parse x402 payment headers from HTTP request
   */
  static parsePaymentHeaders(headers: Record<string, string>): Partial<PaymentRequest> {
    return {
      amount: parseFloat(headers['X-Payment-Amount'] || '0'),
      currency: headers['X-Payment-Currency'] || 'USDC',
      chain: (headers['X-Payment-Chain'] || 'solana') as Chain,
      to: headers['X-Payment-Address'],
      id: headers['X-Payment-ID'],
    };
  }
}
