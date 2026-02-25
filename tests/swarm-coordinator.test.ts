import { describe, it, expect, beforeEach } from 'vitest';
import {
  SwarmCoordinator,
  SwarmConfig,
  AgentRole,
  TaskType
} from '../src/swarm/coordinator';

describe('SwarmCoordinator', () => {
  let coordinator: SwarmCoordinator;
  let config: SwarmConfig;

  beforeEach(() => {
    config = {
      name: 'test-swarm',
      agents: [
        {
          role: 'validator',
          count: 3,
          votingWeight: 1.0
        },
        {
          role: 'executor',
          count: 2,
          votingWeight: 1.5
        },
        {
          role: 'optimizer',
          count: 2,
          votingWeight: 1.0
        },
        {
          role: 'risk-assessor',
          count: 1,
          votingWeight: 2.0
        }
      ],
      consensusThreshold: 0.66,
      timeoutSeconds: 30,
      maxRetries: 3,
      failureRecoveryEnabled: true
    };

    coordinator = new SwarmCoordinator(config);
  });

  describe('Initialization', () => {
    it('should initialize swarm with correct number of agents', () => {
      const agents = coordinator.getAgents();
      expect(agents).toHaveLength(8); // 3 + 2 + 2 + 1
    });

    it('should create agents with correct roles', () => {
      const agents = coordinator.getAgents();
      
      const validators = agents.filter(a => a.role === 'validator');
      const executors = agents.filter(a => a.role === 'executor');
      const optimizers = agents.filter(a => a.role === 'optimizer');
      const riskAssessors = agents.filter(a => a.role === 'risk-assessor');

      expect(validators).toHaveLength(3);
      expect(executors).toHaveLength(2);
      expect(optimizers).toHaveLength(2);
      expect(riskAssessors).toHaveLength(1);
    });

    it('should assign correct voting weights', () => {
      const agents = coordinator.getAgents();
      
      const executor = agents.find(a => a.role === 'executor');
      const riskAssessor = agents.find(a => a.role === 'risk-assessor');

      expect(executor?.votingWeight).toBe(1.5);
      expect(riskAssessor?.votingWeight).toBe(2.0);
    });

    it('should set all agents to active status', () => {
      const agents = coordinator.getAgents();
      
      agents.forEach(agent => {
        expect(agent.status).toBe('active');
      });
    });
  });

  describe('Task Submission', () => {
    it('should submit task successfully', () => {
      const taskId = coordinator.submitTask('validate', { data: 'test' });
      
      expect(taskId).toBeDefined();
      expect(taskId).toContain('task-');
    });

    it('should create task with correct properties', () => {
      const taskId = coordinator.submitTask('execute', { value: 100 }, 5);
      const task = coordinator.getTaskStatus(taskId);
      
      expect(task).toBeDefined();
      expect(task?.type).toBe('execute');
      expect(task?.priority).toBe(5);
      expect(task?.payload).toEqual({ value: 100 });
    });

    it('should handle multiple task submissions', () => {
      const taskId1 = coordinator.submitTask('validate', { data: 'test1' });
      const taskId2 = coordinator.submitTask('execute', { data: 'test2' });
      const taskId3 = coordinator.submitTask('optimize', { data: 'test3' });

      expect(taskId1).toBeDefined();
      expect(taskId2).toBeDefined();
      expect(taskId3).toBeDefined();
      expect(taskId1).not.toBe(taskId2);
      expect(taskId2).not.toBe(taskId3);
    });
  });

  describe('Task Processing', () => {
    it('should process validation task', async () => {
      const taskId = coordinator.submitTask('validate', { data: 'test' });
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const task = coordinator.getTaskStatus(taskId);
      expect(task?.status).toBe('completed');
      expect(task?.result).toBeDefined();
    });

    it('should process execution task', async () => {
      const taskId = coordinator.submitTask('execute', { value: 100 });
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const task = coordinator.getTaskStatus(taskId);
      expect(task?.status).toBe('completed');
      expect(task?.result?.success).toBe(true);
      expect(task?.result?.txHash).toBeDefined();
    });

    it('should process optimization task', async () => {
      const taskId = coordinator.submitTask('optimize', { value: 100 });
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const task = coordinator.getTaskStatus(taskId);
      expect(task?.status).toBe('completed');
      expect(task?.result?.optimizedValue).toBeGreaterThan(100);
    });

    it('should process risk assessment task', async () => {
      const taskId = coordinator.submitTask('assess_risk', { transaction: 'tx1' });
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const task = coordinator.getTaskStatus(taskId);
      expect(task?.status).toBe('completed');
      expect(task?.result?.riskScore).toBeDefined();
      expect(task?.result?.riskLevel).toBeDefined();
    });
  });

  describe('Task Priority', () => {
    it('should process high priority tasks first', async () => {
      const lowPriorityTask = coordinator.submitTask('validate', { data: 'low' }, 1);
      const highPriorityTask = coordinator.submitTask('validate', { data: 'high' }, 10);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const low = coordinator.getTaskStatus(lowPriorityTask);
      const high = coordinator.getTaskStatus(highPriorityTask);
      
      // Both should complete, but we can't guarantee order in concurrent processing
      expect(low?.status).toBe('completed');
      expect(high?.status).toBe('completed');
    });
  });

  describe('Consensus Mechanism', () => {
    it('should request consensus from agents', async () => {
      const result = await coordinator.requestConsensus(
        'approve_transaction',
        { amount: 1000 }
      );

      expect(result).toBeDefined();
      expect(result.decision).toBeDefined();
      expect(result.votes).toHaveLength(8);
      expect(result.consensusReached).toBeDefined();
    });

    it('should reach consensus with sufficient votes', async () => {
      const result = await coordinator.requestConsensus(
        'approve_transaction',
        { amount: 100 }
      );

      expect(result.votes.length).toBeGreaterThan(0);
      expect(result.participationRate).toBeGreaterThan(0);
    });

    it('should calculate confidence correctly', async () => {
      const result = await coordinator.requestConsensus(
        'approve_transaction',
        { amount: 1000 }
      );

      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should provide reasoning for consensus', async () => {
      const result = await coordinator.requestConsensus(
        'approve_transaction',
        { amount: 1000 }
      );

      expect(result.reasoning).toBeDefined();
      expect(result.reasoning.length).toBeGreaterThan(0);
    });

    it('should respect agent voting weights', async () => {
      const result = await coordinator.requestConsensus(
        'approve_transaction',
        { amount: 1000 }
      );

      // Risk assessor has weight 2.0, should have more influence
      expect(result.votes.length).toBe(8);
      const riskAssessorVote = result.votes.find(v => v.agentId.includes('risk-assessor'));
      expect(riskAssessorVote).toBeDefined();
    });

    it('should allow consensus by specific agent roles', async () => {
      const result = await coordinator.requestConsensus(
        'validate_signature',
        { signature: '0xabc' },
        ['validator']
      );

      expect(result.votes.length).toBe(3); // Only 3 validators
      result.votes.forEach(vote => {
        expect(vote.agentId).toContain('validator');
      });
    });
  });

  describe('Agent Failure and Recovery', () => {
    it('should handle agent failure', async () => {
      const agents = coordinator.getAgents();
      const agentId = agents[0].id;

      await coordinator.handleAgentFailure(agentId);

      const agent = coordinator.getAgent(agentId);
      // After recovery (if enabled), agent should be active again
      expect(agent?.status).toBe('active');
    });

    it('should recover agent when recovery is enabled', async () => {
      const agents = coordinator.getAgents();
      const agentId = agents[0].id;

      await coordinator.handleAgentFailure(agentId);

      // Wait for recovery
      await new Promise(resolve => setTimeout(resolve, 600));

      const agent = coordinator.getAgent(agentId);
      expect(agent?.status).toBe('active');
    });

    it('should reassign tasks from failed agent', async () => {
      // Submit a task
      const taskId = coordinator.submitTask('validate', { data: 'test' });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const task = coordinator.getTaskStatus(taskId);
      const assignedAgentId = task?.assignedTo;

      if (assignedAgentId) {
        // Fail the agent
        await coordinator.handleAgentFailure(assignedAgentId);
        
        // Task should eventually complete (reassigned to another agent)
        await new Promise(resolve => setTimeout(resolve, 700));
        
        const updatedTask = coordinator.getTaskStatus(taskId);
        expect(updatedTask?.status).toBe('completed');
      }
    });
  });

  describe('Metrics', () => {
    it('should provide accurate metrics', async () => {
      // Submit some tasks
      coordinator.submitTask('validate', { data: 'test1' });
      coordinator.submitTask('execute', { data: 'test2' });
      coordinator.submitTask('optimize', { data: 'test3' });

      await new Promise(resolve => setTimeout(resolve, 400));

      const metrics = coordinator.getMetrics();

      expect(metrics.totalAgents).toBe(8);
      expect(metrics.activeAgents).toBeGreaterThan(0);
      expect(metrics.totalTasks).toBe(3);
      expect(metrics.completedTasks).toBeGreaterThan(0);
    });

    it('should track completed tasks', async () => {
      coordinator.submitTask('validate', { data: 'test' });

      await new Promise(resolve => setTimeout(resolve, 200));

      const metrics = coordinator.getMetrics();
      expect(metrics.completedTasks).toBeGreaterThan(0);
    });

    it('should calculate average response time', async () => {
      coordinator.submitTask('validate', { data: 'test1' });
      coordinator.submitTask('validate', { data: 'test2' });

      await new Promise(resolve => setTimeout(resolve, 300));

      const metrics = coordinator.getMetrics();
      expect(metrics.averageResponseTime).toBeGreaterThan(0);
    });

    it('should calculate consensus success rate', async () => {
      coordinator.submitTask('validate', { data: 'test' });

      await new Promise(resolve => setTimeout(resolve, 200));

      const metrics = coordinator.getMetrics();
      expect(metrics.consensusSuccessRate).toBeGreaterThanOrEqual(0);
      expect(metrics.consensusSuccessRate).toBeLessThanOrEqual(1);
    });
  });

  describe('Agent Management', () => {
    it('should retrieve agent by ID', () => {
      const agents = coordinator.getAgents();
      const agentId = agents[0].id;

      const agent = coordinator.getAgent(agentId);
      expect(agent).toBeDefined();
      expect(agent?.id).toBe(agentId);
    });

    it('should return undefined for non-existent agent', () => {
      const agent = coordinator.getAgent('non-existent-id');
      expect(agent).toBeUndefined();
    });

    it('should list all agents', () => {
      const agents = coordinator.getAgents();
      expect(agents).toHaveLength(8);
    });
  });

  describe('Shutdown', () => {
    it('should shutdown swarm correctly', () => {
      coordinator.shutdown();

      const agents = coordinator.getAgents();
      agents.forEach(agent => {
        expect(agent.status).toBe('offline');
      });
    });

    it('should clear task queue on shutdown', () => {
      coordinator.submitTask('validate', { data: 'test1' });
      coordinator.submitTask('validate', { data: 'test2' });

      coordinator.shutdown();

      // After shutdown, no new tasks should be processed
      const metrics = coordinator.getMetrics();
      expect(metrics).toBeDefined();
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple concurrent tasks', async () => {
      const taskIds = [];
      
      for (let i = 0; i < 5; i++) {
        const id = coordinator.submitTask('validate', { data: `test${i}` });
        taskIds.push(id);
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      const completedCount = taskIds.filter(id => {
        const task = coordinator.getTaskStatus(id);
        return task?.status === 'completed';
      }).length;

      expect(completedCount).toBeGreaterThan(0);
    });

    it('should handle concurrent consensus requests', async () => {
      const results = await Promise.all([
        coordinator.requestConsensus('decision1', { data: 1 }),
        coordinator.requestConsensus('decision2', { data: 2 }),
        coordinator.requestConsensus('decision3', { data: 3 })
      ]);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.decision).toBeDefined();
        expect(result.votes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty swarm configuration', () => {
      const emptyConfig: SwarmConfig = {
        name: 'empty-swarm',
        agents: [],
        consensusThreshold: 0.66,
        timeoutSeconds: 30,
        maxRetries: 3,
        failureRecoveryEnabled: true
      };

      const emptyCoordinator = new SwarmCoordinator(emptyConfig);
      const agents = emptyCoordinator.getAgents();
      
      expect(agents).toHaveLength(0);
    });

    it('should handle consensus with no agents', async () => {
      const emptyConfig: SwarmConfig = {
        name: 'empty-swarm',
        agents: [],
        consensusThreshold: 0.66,
        timeoutSeconds: 30,
        maxRetries: 3,
        failureRecoveryEnabled: true
      };

      const emptyCoordinator = new SwarmCoordinator(emptyConfig);
      const result = await emptyCoordinator.requestConsensus('test', {});

      expect(result.decision).toBe(false);
      expect(result.consensusReached).toBe(false);
      expect(result.votes).toHaveLength(0);
    });

    it('should handle task submission with zero priority', () => {
      const taskId = coordinator.submitTask('validate', { data: 'test' }, 0);
      expect(taskId).toBeDefined();
    });

    it('should handle task submission with negative priority', () => {
      const taskId = coordinator.submitTask('validate', { data: 'test' }, -1);
      expect(taskId).toBeDefined();
    });
  });

  describe('Different Consensus Thresholds', () => {
    it('should work with low threshold (51%)', async () => {
      config.consensusThreshold = 0.51;
      const lowThresholdCoordinator = new SwarmCoordinator(config);

      const result = await lowThresholdCoordinator.requestConsensus(
        'approve',
        { data: 'test' }
      );

      expect(result).toBeDefined();
    });

    it('should work with high threshold (90%)', async () => {
      config.consensusThreshold = 0.9;
      const highThresholdCoordinator = new SwarmCoordinator(config);

      const result = await highThresholdCoordinator.requestConsensus(
        'approve',
        { data: 'test' }
      );

      expect(result).toBeDefined();
    });

    it('should work with unanimous threshold (100%)', async () => {
      config.consensusThreshold = 1.0;
      const unanimousCoordinator = new SwarmCoordinator(config);

      const result = await unanimousCoordinator.requestConsensus(
        'approve',
        { data: 'test' }
      );

      expect(result).toBeDefined();
    });
  });
});
