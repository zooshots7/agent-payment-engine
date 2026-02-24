import type { Agent, AgentMessage } from '../types/agent.js';
import type { PaymentRequest, PaymentResponse } from '../types/payment.js';
import { X402PaymentHandler } from '../core/x402.js';
import { AgentWallet } from '../core/wallet.js';
import { randomUUID } from 'crypto';

/**
 * Agent-to-Agent Communication Protocol
 * Handles message passing and payment negotiation between agents
 */

export type MessageType =
  | 'payment_request'
  | 'payment_response'
  | 'negotiation'
  | 'status'
  | 'approval_request';

export interface NegotiationPayload {
  proposedAmount: number;
  currency: string;
  terms?: Record<string, unknown>;
  round: number;
  maxRounds: number;
}

export interface ApprovalRequest {
  paymentRequest: PaymentRequest;
  reason: string;
  timeout: number;
}

export class AgentProtocol {
  private messageQueue: Map<string, AgentMessage[]> = new Map();
  private x402Handler?: X402PaymentHandler;

  constructor(x402Handler?: X402PaymentHandler) {
    this.x402Handler = x402Handler;
  }

  /**
   * Send message from one agent to another
   */
  async sendMessage(from: Agent, to: Agent, type: MessageType, payload: unknown): Promise<string> {
    const message: AgentMessage = {
      from: from.id,
      to: to.id,
      type,
      payload,
      timestamp: new Date(),
    };

    // Add to recipient's queue
    if (!this.messageQueue.has(to.id)) {
      this.messageQueue.set(to.id, []);
    }
    this.messageQueue.get(to.id)!.push(message);

    console.warn(
      `[Protocol] Message sent: ${from.config.name} → ${to.config.name} (${type})`
    );

    return randomUUID();
  }

  /**
   * Get messages for an agent
   */
  getMessages(agentId: string, type?: MessageType): AgentMessage[] {
    const messages = this.messageQueue.get(agentId) || [];
    if (type) {
      return messages.filter((msg) => msg.type === type);
    }
    return messages;
  }

  /**
   * Clear messages for an agent
   */
  clearMessages(agentId: string): void {
    this.messageQueue.delete(agentId);
  }

  /**
   * Initiate payment request between agents
   */
  async requestPayment(
    from: Agent,
    to: Agent,
    amount: number,
    metadata?: Record<string, unknown>
  ): Promise<string> {
    if (!this.x402Handler) {
      throw new Error('x402 handler not configured');
    }

    // Check max transaction limits
    if (amount > from.config.rules.maxTransaction) {
      throw new Error(
        `Payment amount ${amount} exceeds max transaction limit ${from.config.rules.maxTransaction}`
      );
    }

    // Check if approval is required
    const requiresApproval =
      from.config.rules.requireApprovalAbove &&
      amount > from.config.rules.requireApprovalAbove;

    if (requiresApproval) {
      // Send approval request instead
      return await this.requestApproval(from, to, amount, metadata);
    }

    // Create payment request (using agent wallet addresses)
    const paymentRequest = this.x402Handler.createPaymentRequest(
      from.config.wallet || '',
      to.config.wallet || '',
      amount,
      metadata
    );

    // Send as agent message
    return await this.sendMessage(from, to, 'payment_request', paymentRequest);
  }

  /**
   * Execute payment between agents
   */
  async executePayment(
    request: PaymentRequest,
    wallet: AgentWallet
  ): Promise<PaymentResponse> {
    if (!this.x402Handler) {
      throw new Error('x402 handler not configured');
    }

    return await this.x402Handler.executePayment(request, wallet);
  }

  /**
   * Start negotiation between agents
   */
  async startNegotiation(
    from: Agent,
    to: Agent,
    initialAmount: number,
    maxRounds = 5
  ): Promise<string> {
    const negotiation: NegotiationPayload = {
      proposedAmount: initialAmount,
      currency: 'USDC',
      round: 1,
      maxRounds,
    };

    return await this.sendMessage(from, to, 'negotiation', negotiation);
  }

  /**
   * Respond to negotiation
   */
  async respondToNegotiation(
    from: Agent,
    to: Agent,
    originalPayload: NegotiationPayload,
    counterOffer: number,
    accept = false
  ): Promise<string> {
    if (accept) {
      // Convert to payment request
      return await this.requestPayment(from, to, originalPayload.proposedAmount);
    }

    const response: NegotiationPayload = {
      ...originalPayload,
      proposedAmount: counterOffer,
      round: originalPayload.round + 1,
    };

    // Check if max rounds exceeded
    if (response.round > response.maxRounds) {
      throw new Error('Negotiation max rounds exceeded');
    }

    return await this.sendMessage(from, to, 'negotiation', response);
  }

  /**
   * Request approval for high-value transaction
   */
  private async requestApproval(
    from: Agent,
    to: Agent,
    amount: number,
    metadata?: Record<string, unknown>
  ): Promise<string> {
    if (!this.x402Handler) {
      throw new Error('x402 handler not configured');
    }

    const paymentRequest = this.x402Handler.createPaymentRequest(
      from.config.wallet || '',
      to.config.wallet || '',
      amount,
      metadata
    );

    const approvalRequest: ApprovalRequest = {
      paymentRequest,
      reason: `Amount ${amount} exceeds approval threshold`,
      timeout: 300000, // 5 minutes
    };

    return await this.sendMessage(from, to, 'approval_request', approvalRequest);
  }

  /**
   * Get pending approvals for an agent
   */
  getPendingApprovals(agentId: string): ApprovalRequest[] {
    const messages = this.getMessages(agentId, 'approval_request');
    return messages.map((msg) => msg.payload as ApprovalRequest);
  }

  /**
   * Get message queue stats
   */
  getStats(): {
    totalMessages: number;
    messagesByAgent: Record<string, number>;
    messagesByType: Record<string, number>;
  } {
    let totalMessages = 0;
    const messagesByAgent: Record<string, number> = {};
    const messagesByType: Record<string, number> = {};

    this.messageQueue.forEach((messages, agentId) => {
      totalMessages += messages.length;
      messagesByAgent[agentId] = messages.length;

      messages.forEach((msg) => {
        messagesByType[msg.type] = (messagesByType[msg.type] || 0) + 1;
      });
    });

    return {
      totalMessages,
      messagesByAgent,
      messagesByType,
    };
  }
}
