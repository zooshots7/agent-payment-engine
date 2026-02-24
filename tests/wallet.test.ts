import { describe, it, expect } from 'vitest';
import { AgentWallet, MultiSigWallet } from '../src/core/wallet.js';
import { PublicKey } from '@solana/web3.js';

describe('AgentWallet', () => {
  it('should generate a new wallet', () => {
    const wallet = AgentWallet.generate();

    expect(wallet.publicKey).toBeDefined();
    expect(wallet.type).toBe('hot');
    expect(wallet.canSign()).toBe(true);
  });

  it('should generate hot and cold wallets', () => {
    const hotWallet = AgentWallet.generate('hot');
    const coldWallet = AgentWallet.generate('cold');

    expect(hotWallet.canSign()).toBe(true);
    expect(coldWallet.canSign()).toBe(false);
  });

  it('should export wallet config without secret', () => {
    const wallet = AgentWallet.generate();
    const config = wallet.export(false);

    expect(config.publicKey).toBeDefined();
    expect(config.type).toBe('hot');
    expect(config.secretKey).toBeUndefined();
  });

  it('should export wallet config with secret for hot wallets', () => {
    const wallet = AgentWallet.generate('hot');
    const config = wallet.export(true);

    expect(config.publicKey).toBeDefined();
    expect(config.secretKey).toBeDefined();
  });

  it('should import wallet from secret key', () => {
    const originalWallet = AgentWallet.generate();
    const config = originalWallet.export(true);

    const importedWallet = AgentWallet.fromSecretKey(config.secretKey!);

    expect(importedWallet.getPublicKey()).toBe(originalWallet.getPublicKey());
  });

  it('should get public key as string', () => {
    const wallet = AgentWallet.generate();
    const publicKeyString = wallet.getPublicKey();

    expect(typeof publicKeyString).toBe('string');
    expect(publicKeyString.length).toBeGreaterThan(0);
  });

  it('should throw error for invalid secret key', () => {
    expect(() => AgentWallet.fromSecretKey('invalid-key')).toThrow();
  });

  it('should sign and verify messages', () => {
    const wallet = AgentWallet.generate();
    const message = new TextEncoder().encode('test message');
    
    const signature = wallet.sign(message);
    const isValid = AgentWallet.verify(message, signature, wallet.publicKey);

    expect(isValid).toBe(true);
  });

  it('should reject invalid signatures', () => {
    const wallet = AgentWallet.generate();
    const message = new TextEncoder().encode('test message');
    const wrongMessage = new TextEncoder().encode('wrong message');
    
    const signature = wallet.sign(message);
    const isValid = AgentWallet.verify(wrongMessage, signature, wallet.publicKey);

    expect(isValid).toBe(false);
  });
});

describe('MultiSigWallet', () => {
  it('should create multi-sig wallet', () => {
    const signer1 = AgentWallet.generate();
    const signer2 = AgentWallet.generate();
    const signer3 = AgentWallet.generate();

    const multiSig = new MultiSigWallet(
      [signer1.publicKey, signer2.publicKey, signer3.publicKey],
      2
    );

    expect(multiSig.getThreshold()).toBe(2);
    expect(multiSig.getSigners()).toHaveLength(3);
  });

  it('should validate enough signatures', () => {
    const signer1 = AgentWallet.generate();
    const signer2 = AgentWallet.generate();
    const signer3 = AgentWallet.generate();

    const multiSig = new MultiSigWallet(
      [signer1.publicKey, signer2.publicKey, signer3.publicKey],
      2
    );

    const hasEnough = multiSig.hasEnoughSignatures([
      signer1.publicKey,
      signer2.publicKey,
    ]);

    expect(hasEnough).toBe(true);
  });

  it('should reject insufficient signatures', () => {
    const signer1 = AgentWallet.generate();
    const signer2 = AgentWallet.generate();
    const signer3 = AgentWallet.generate();

    const multiSig = new MultiSigWallet(
      [signer1.publicKey, signer2.publicKey, signer3.publicKey],
      2
    );

    const hasEnough = multiSig.hasEnoughSignatures([signer1.publicKey]);

    expect(hasEnough).toBe(false);
  });

  it('should throw error if threshold exceeds signers', () => {
    const signer1 = AgentWallet.generate();

    expect(() => new MultiSigWallet([signer1.publicKey], 2)).toThrow();
  });

  it('should throw error if threshold is less than 1', () => {
    const signer1 = AgentWallet.generate();

    expect(() => new MultiSigWallet([signer1.publicKey], 0)).toThrow();
  });

  it('should ignore invalid signers', () => {
    const signer1 = AgentWallet.generate();
    const signer2 = AgentWallet.generate();
    const invalidSigner = AgentWallet.generate();

    const multiSig = new MultiSigWallet([signer1.publicKey, signer2.publicKey], 2);

    const hasEnough = multiSig.hasEnoughSignatures([
      signer1.publicKey,
      invalidSigner.publicKey,
    ]);

    expect(hasEnough).toBe(false);
  });
});
