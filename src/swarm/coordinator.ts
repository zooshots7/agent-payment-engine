/**
 * Multi-Agent Swarm Coordinator
 * 
 * Coordinates multiple specialized agents to handle complex payment scenarios:
 * - Task distribution
 * - Consensus mechanisms
 * - Failure recovery
 * - Result aggregation
 */

export interface Agent {
  id: string;
  role: AgentRole;
  capabilities: string[];
  votingWeight: number;
  status: AgentStatus;
  lastActive: Date;
}

export type AgentRole = 'validator' | 'executor' | 'optimizer' | 'risk-assessor' | 'coordinator';
export type AgentStatus = 'active' | 'busy' | 'offline' | 'failed';

export interface Task {
  id: string;
  type: TaskType;
  priority: number;
  payload: any;
  assignedTo?: string;
  status: TaskStatus;
  result?: any;
  createdAt: Date;
  deadline?: Date;
}

export type TaskType = 'validate' | 'execute' | 'optimize' | 'assess_risk' | 'coordinate';
export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed';

export interface SwarmConfig {
  name: string;
  agents: AgentConfig[];
  consensusThreshold: number; // 0-1 (e.g., 0.66 for 66% agreement)
  timeoutSeconds: number;
  maxRetries: number;
  failureRecoveryEnabled: boolean;
}

export interface AgentConfig {
  role: AgentRole;
  count: number;
  votingWeight: number;
  capabilities?: string[];
}

export interface Vote {
  agentId: string;
  decision: boolean; // true = approve, false = reject
  confidence: number; // 0-1
  reasoning?: string;
  timestamp: Date;
}

export interface ConsensusResult {
  decision: boolean;
  confidence: number;
  votes: Vote[];
  participationRate: number;
  consensusReached: boolean;
  reasoning: string[];
}

export interface SwarmMetrics {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageResponseTime: number;
  consensusSuccessRate: number;
}

export class SwarmCoordinator {
  private config: SwarmConfig;
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private taskQueue: Task[] = [];
  private completedTasks: Task[] = [];
  private failedTasks: Task[] = [];

  constructor(config: SwarmConfig) {
    this.config = config;
    this.initializeAgents();
  }

  /**
   * Initialize agent swarm based on config
   */
  private initializeAgents(): void {
    console.log(`🤖 Initializing swarm: ${this.config.name}`);

    this.config.agents.forEach(agentConfig => {
      for (let i = 0; i < agentConfig.count; i++) {
        const agent: Agent = {
          id: `${agentConfig.role}-${i + 1}`,
          role: agentConfig.role,
          capabilities: agentConfig.capabilities || [],
          votingWeight: agentConfig.votingWeight,
          status: 'active',
          lastActive: new Date()
        };

        this.agents.set(agent.id, agent);
        console.log(`  ✓ Created ${agent.role} agent: ${agent.id}`);
      }
    });

    console.log(`✅ Swarm initialized with ${this.agents.size} agents\n`);
  }

  /**
   * Submit task to swarm
   */
  submitTask(type: TaskType, payload: any, priority: number = 5, deadline?: Date): string {
    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      priority,
      payload,
      status: 'pending',
      createdAt: new Date(),
      deadline
    };

    this.tasks.set(task.id, task);
    this.taskQueue.push(task);
    this.sortTaskQueue();

    console.log(`📥 Task submitted: ${task.id} (${type}, priority: ${priority})`);

    // Auto-process task
    this.processNextTask();

    return task.id;
  }

  /**
   * Sort task queue by priority
   */
  private sortTaskQueue(): void {
    this.taskQueue.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Process next task in queue
   */
  private async processNextTask(): Promise<void> {
    if (this.taskQueue.length === 0) return;

    const task = this.taskQueue.shift();
    if (!task) return;

    console.log(`⚙️  Processing task: ${task.id}`);

    // Find suitable agents for this task
    const suitableAgents = this.findSuitableAgents(task);

    if (suitableAgents.length === 0) {
      console.log(`⚠️  No suitable agents found for task ${task.id}`);
      task.status = 'failed';
      this.failedTasks.push(task);
      return;
    }

    // Assign task to best available agent
    const assignedAgent = suitableAgents[0];
    task.assignedTo = assignedAgent.id;
    task.status = 'assigned';
    assignedAgent.status = 'busy';

    console.log(`  Assigned to: ${assignedAgent.id}`);

    // Simulate task execution
    await this.executeTask(task, assignedAgent);

    // Free up agent
    assignedAgent.status = 'active';
    assignedAgent.lastActive = new Date();

    // Process next task
    this.processNextTask();
  }

  /**
   * Find suitable agents for a task
   */
  private findSuitableAgents(task: Task): Agent[] {
    // Map task types to agent roles
    const roleMapping: Record<TaskType, AgentRole[]> = {
      'validate': ['validator', 'risk-assessor'],
      'execute': ['executor'],
      'optimize': ['optimizer'],
      'assess_risk': ['risk-assessor', 'validator'],
      'coordinate': ['coordinator']
    };

    const suitableRoles = roleMapping[task.type] || [];

    return Array.from(this.agents.values())
      .filter(agent => 
        suitableRoles.includes(agent.role) &&
        agent.status === 'active'
      )
      .sort((a, b) => b.votingWeight - a.votingWeight);
  }

  /**
   * Execute task
   */
  private async executeTask(task: Task, agent: Agent): Promise<void> {
    console.log(`  🔄 Executing ${task.type} task...`);

    task.status = 'in_progress';

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate result based on task type
    task.result = this.simulateTaskResult(task, agent);
    task.status = 'completed';
    this.completedTasks.push(task);

    console.log(`  ✅ Task ${task.id} completed by ${agent.id}`);
  }

  /**
   * Simulate task result
   */
  private simulateTaskResult(task: Task, agent: Agent): any {
    switch (task.type) {
      case 'validate':
        return {
          valid: true,
          confidence: 0.9,
          checks: ['signature', 'balance', 'nonce'],
          agent: agent.id
        };

      case 'execute':
        return {
          success: true,
          txHash: '0x' + Math.random().toString(36).substr(2, 64),
          gasUsed: Math.floor(Math.random() * 100000) + 21000,
          agent: agent.id
        };

      case 'optimize':
        return {
          optimizedValue: task.payload.value * 1.05,
          improvement: 5,
          strategy: 'compound',
          agent: agent.id
        };

      case 'assess_risk':
        return {
          riskScore: Math.random() * 0.3, // Low risk
          riskLevel: 'low',
          factors: ['velocity', 'amount', 'pattern'],
          agent: agent.id
        };

      default:
        return { success: true, agent: agent.id };
    }
  }

  /**
   * Request consensus from agent swarm
   */
  async requestConsensus(
    decision: string,
    data: any,
    agentRoles?: AgentRole[]
  ): Promise<ConsensusResult> {
    console.log(`🗳️  Requesting consensus: ${decision}`);

    // Select agents to vote
    const votingAgents = agentRoles
      ? Array.from(this.agents.values()).filter(a => agentRoles.includes(a.role))
      : Array.from(this.agents.values());

    console.log(`  Voting agents: ${votingAgents.length}`);

    // Collect votes
    const votes: Vote[] = [];

    for (const agent of votingAgents) {
      const vote = await this.collectVote(agent, decision, data);
      votes.push(vote);
    }

    // Calculate consensus
    const result = this.calculateConsensus(votes);

    console.log(`  Decision: ${result.decision ? '✅ APPROVED' : '❌ REJECTED'}`);
    console.log(`  Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`  Consensus: ${result.consensusReached ? 'REACHED' : 'NOT REACHED'}\n`);

    return result;
  }

  /**
   * Collect vote from an agent
   */
  private async collectVote(agent: Agent, _decision: string, _data: any): Promise<Vote> {
    // Simulate agent decision-making
    await new Promise(resolve => setTimeout(resolve, 10));

    // Different roles have different voting patterns
    let approvalChance = 0.7;
    let confidence = 0.8;

    switch (agent.role) {
      case 'validator':
        approvalChance = 0.85;
        confidence = 0.9;
        break;
      case 'risk-assessor':
        approvalChance = 0.6; // More conservative
        confidence = 0.95;
        break;
      case 'optimizer':
        approvalChance = 0.75;
        confidence = 0.85;
        break;
      case 'executor':
        approvalChance = 0.8;
        confidence = 0.85;
        break;
    }

    const approved = Math.random() < approvalChance;

    return {
      agentId: agent.id,
      decision: approved,
      confidence,
      reasoning: approved ? 'Approved based on analysis' : 'Rejected due to risk factors',
      timestamp: new Date()
    };
  }

  /**
   * Calculate consensus from votes
   */
  private calculateConsensus(votes: Vote[]): ConsensusResult {
    if (votes.length === 0) {
      return {
        decision: false,
        confidence: 0,
        votes: [],
        participationRate: 0,
        consensusReached: false,
        reasoning: ['No votes collected']
      };
    }

    // Calculate weighted votes
    let totalWeightApprove = 0;
    let totalWeightReject = 0;
    let totalWeight = 0;

    votes.forEach(vote => {
      const agent = this.agents.get(vote.agentId);
      if (!agent) return;

      const weight = agent.votingWeight * vote.confidence;
      totalWeight += agent.votingWeight;

      if (vote.decision) {
        totalWeightApprove += weight;
      } else {
        totalWeightReject += weight;
      }
    });

    // Calculate approval ratio
    const approvalRatio = totalWeightApprove / (totalWeightApprove + totalWeightReject);
    const consensusReached = approvalRatio >= this.config.consensusThreshold ||
                            (1 - approvalRatio) >= this.config.consensusThreshold;

    const decision = approvalRatio >= this.config.consensusThreshold;

    // Calculate average confidence
    const avgConfidence = votes.reduce((sum, v) => sum + v.confidence, 0) / votes.length;

    // Participation rate
    const participationRate = votes.length / this.agents.size;

    // Generate reasoning
    const reasoning: string[] = [];
    reasoning.push(`Approval ratio: ${(approvalRatio * 100).toFixed(1)}%`);
    reasoning.push(`Threshold: ${(this.config.consensusThreshold * 100).toFixed(1)}%`);
    reasoning.push(`Participating agents: ${votes.length}/${this.agents.size}`);

    if (consensusReached) {
      reasoning.push(decision ? 'Consensus: APPROVE' : 'Consensus: REJECT');
    } else {
      reasoning.push('Consensus: NOT REACHED');
    }

    return {
      decision,
      confidence: avgConfidence,
      votes,
      participationRate,
      consensusReached,
      reasoning
    };
  }

  /**
   * Handle agent failure and recovery
   */
  async handleAgentFailure(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    console.log(`⚠️  Agent failure detected: ${agentId}`);

    agent.status = 'failed';

    // Find tasks assigned to this agent
    const failedAgentTasks = Array.from(this.tasks.values())
      .filter(t => t.assignedTo === agentId && t.status !== 'completed');

    if (failedAgentTasks.length > 0) {
      console.log(`  Reassigning ${failedAgentTasks.length} task(s)...`);

      failedAgentTasks.forEach(task => {
        task.status = 'pending';
        task.assignedTo = undefined;
        this.taskQueue.unshift(task); // High priority
      });

      this.sortTaskQueue();
    }

    // Attempt recovery
    if (this.config.failureRecoveryEnabled) {
      await this.recoverAgent(agentId);
    }
  }

  /**
   * Recover failed agent
   */
  private async recoverAgent(agentId: string): Promise<void> {
    console.log(`  🔧 Attempting to recover agent ${agentId}...`);

    await new Promise(resolve => setTimeout(resolve, 500));

    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = 'active';
      agent.lastActive = new Date();
      console.log(`  ✅ Agent ${agentId} recovered`);
    }
  }

  /**
   * Get swarm metrics
   */
  getMetrics(): SwarmMetrics {
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status === 'active');
    const totalTasks = this.tasks.size;
    const completedTasks = this.completedTasks.length;
    const failedTasks = this.failedTasks.length;

    // Calculate average response time
    const responseTimes = this.completedTasks.map(t => {
      const duration = new Date().getTime() - t.createdAt.getTime();
      return duration;
    });

    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
      : 0;

    // Calculate consensus success rate
    const consensusSuccessRate = completedTasks > 0
      ? completedTasks / (completedTasks + failedTasks)
      : 0;

    return {
      totalAgents: this.agents.size,
      activeAgents: activeAgents.length,
      totalTasks,
      completedTasks,
      failedTasks,
      averageResponseTime,
      consensusSuccessRate
    };
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all agents
   */
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Shutdown swarm
   */
  shutdown(): void {
    console.log(`🛑 Shutting down swarm: ${this.config.name}`);

    this.agents.forEach(agent => {
      agent.status = 'offline';
    });

    this.taskQueue = [];
    console.log('✅ Swarm shutdown complete');
  }
}
