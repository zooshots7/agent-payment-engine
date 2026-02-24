import { Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import * as nacl from 'tweetnacl';

/**
 * Agent Wallet Manager
 * Handles keypair generation and wallet management for AI agents
 */

export interface WalletConfig {
  type: 'hot' | 'cold';
  publicKey: string;
  secretKey?: string; // Only for hot wallets
}

export class AgentWallet {
  private keypair: Keypair;
  public readonly publicKey: PublicKey;
  public readonly type: 'hot' | 'cold';

  constructor(keypair: Keypair, type: 'hot' | 'cold' = 'hot') {
    this.keypair = keypair;
    this.publicKey = keypair.publicKey;
    this.type = type;
  }

  /**
   * Generate a new random wallet
   */
  static generate(type: 'hot' | 'cold' = 'hot'): AgentWallet {
    const keypair = Keypair.generate();
    return new AgentWallet(keypair, type);
  }

  /**
   * Import wallet from secret key (base58 encoded)
   */
  static fromSecretKey(secretKey: string, type: 'hot' | 'cold' = 'hot'): AgentWallet {
    try {
      const decoded = bs58.decode(secretKey);
      const keypair = Keypair.fromSecretKey(decoded);
      return new AgentWallet(keypair, type);
    } catch (error) {
      throw new Error(`Invalid secret key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import wallet from seed phrase (not implemented - requires bip39)
   */
  static fromMnemonic(_mnemonic: string): AgentWallet {
    throw new Error('Mnemonic import not yet implemented - use fromSecretKey instead');
  }

  /**
   * Export wallet config (public key + optional secret for hot wallets)
   */
  export(includeSecret = false): WalletConfig {
    const config: WalletConfig = {
      type: this.type,
      publicKey: this.publicKey.toBase58(),
    };

    if (includeSecret && this.type === 'hot') {
      config.secretKey = bs58.encode(this.keypair.secretKey);
    }

    return config;
  }

  /**
   * Get the keypair (for signing transactions)
   */
  getKeypair(): Keypair {
    return this.keypair;
  }

  /**
   * Sign a message
   */
  sign(message: Uint8Array): Uint8Array {
    return nacl.sign.detached(message, this.keypair.secretKey);
  }

  /**
   * Verify a signature
   */
  static verify(message: Uint8Array, signature: Uint8Array, publicKey: PublicKey): boolean {
    return nacl.sign.detached.verify(message, signature, publicKey.toBytes());
  }

  /**
   * Get public key as string
   */
  getPublicKey(): string {
    return this.publicKey.toBase58();
  }

  /**
   * Check if wallet has secret key (can sign)
   */
  canSign(): boolean {
    return this.type === 'hot';
  }
}

/**
 * Multi-sig wallet support
 */
export class MultiSigWallet {
  private signers: PublicKey[];
  private threshold: number;

  constructor(signers: PublicKey[], threshold: number) {
    if (threshold > signers.length) {
      throw new Error('Threshold cannot exceed number of signers');
    }
    if (threshold < 1) {
      throw new Error('Threshold must be at least 1');
    }

    this.signers = signers;
    this.threshold = threshold;
  }

  /**
   * Check if enough signatures are present
   */
  hasEnoughSignatures(signatures: PublicKey[]): boolean {
    const validSigners = signatures.filter((sig) =>
      this.signers.some((signer) => signer.equals(sig))
    );
    return validSigners.length >= this.threshold;
  }

  /**
   * Get required signatures count
   */
  getThreshold(): number {
    return this.threshold;
  }

  /**
   * Get all authorized signers
   */
  getSigners(): PublicKey[] {
    return [...this.signers];
  }
}
