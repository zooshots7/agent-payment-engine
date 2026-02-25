/**
 * SwarmCoordinator Demo
 * 
 * Demonstrates multi-agent coordination for payment processing:
 * - Task distribution across specialized agents
 * - Consensus mechanisms for decision-making
 * - Failure recovery
 * - Performance metrics
 */

import {
  SwarmCoordinator,
  SwarmConfig,
  AgentRole
} from '../src/swarm/coordinator';

/**
 * Scenario 1: Basic Task Distribution
 * Shows how different task types are assigned to specialized agents
 */
async function scenarioBasicTaskDistribution() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 1: Basic Task Distribution');
  console.log('═'.repeat(80) + '\n');

  const config: SwarmConfig = {
    name: 'payment-swarm',
    agents: [
      { role: 'validator', count: 2, votingWeight: 1.0 },
      { role: 'executor', count: 2, votingWeight: 1.2 },
      { role: 'risk-assessor', count: 1, votingWeight: 1.5 }
    ],
    consensusThreshold: 0.66,
    timeoutSeconds: 30,
    maxRetries: 3,
    failureRecoveryEnabled: true
  };

  const coordinator = new SwarmCoordinator(config);

  // Submit different types of tasks
  const tasks = [
    { type: 'validate' as const, description: 'Validate transaction signature', payload: { txSignature: '0xabc123', sender: 'user1' } },
    { type: 'execute' as const, description: 'Execute payment', payload: { amount: 1000, recipient: 'user2' } },
    { type: 'assess_risk' as const, description: 'Assess fraud risk', payload: { amount: 5000, velocity: 10 } },
    { type: 'optimize' as const, description: 'Optimize gas fees', payload: { gasLimit: 200000 } }
  ];

  for (const task of tasks) {
    console.log(`📋 Submitting: ${task.description}`);
    coordinator.submitTask(task.type, task.payload, 5);
  }

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('\n📊 Task Distribution Results:\n');
  const metrics = coordinator.getMetrics();
  console.log(`Total Tasks: ${metrics.totalTasks}`);
  console.log(`Completed: ${metrics.completedTasks}`);
  console.log(`Failed: ${metrics.failedTasks}`);
  console.log(`Average Response Time: ${metrics.averageResponseTime.toFixed(0)}ms`);

  coordinator.shutdown();
  console.log('\n');
}

/**
 * Scenario 2: Consensus Decision-Making
 * Shows how the swarm reaches consensus for critical decisions
 */
async function scenarioConsensusDecisionMaking() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 2: Consensus Decision-Making');
  console.log('═'.repeat(80) + '\n');

  const config: SwarmConfig = {
    name: 'consensus-swarm',
    agents: [
      { role: 'validator', count: 3, votingWeight: 1.0 },
      { role: 'risk-assessor', count: 2, votingWeight: 2.0 },
      { role: 'executor', count: 1, votingWeight: 1.0 }
    ],
    consensusThreshold: 0.7, // 70% agreement required
    timeoutSeconds: 30,
    maxRetries: 3,
    failureRecoveryEnabled: true
  };

  const coordinator = new SwarmCoordinator(config);

  // Decision 1: Small transaction (should approve easily)
  console.log('📝 Decision 1: Approve $100 payment\n');
  const result1 = await coordinator.requestConsensus(
    'approve_small_payment',
    { amount: 100, recipient: 'trusted_user', riskScore: 0.1 }
  );

  console.log(`  Result: ${result1.decision ? '✅ APPROVED' : '❌ REJECTED'}`);
  console.log(`  Confidence: ${(result1.confidence * 100).toFixed(1)}%`);
  console.log(`  Votes: ${result1.votes.filter(v => v.decision).length}/${result1.votes.length} approved`);
  console.log(`  Consensus Reached: ${result1.consensusReached ? 'YES' : 'NO'}`);
  console.log(`  Reasoning:`);
  result1.reasoning.forEach(r => console.log(`    - ${r}`));

  // Decision 2: Large suspicious transaction (more scrutiny)
  console.log('\n📝 Decision 2: Approve $10,000 payment to new address\n');
  const result2 = await coordinator.requestConsensus(
    'approve_large_payment',
    { amount: 10000, recipient: 'new_user', riskScore: 0.8 }
  );

  console.log(`  Result: ${result2.decision ? '✅ APPROVED' : '❌ REJECTED'}`);
  console.log(`  Confidence: ${(result2.confidence * 100).toFixed(1)}%`);
  console.log(`  Votes: ${result2.votes.filter(v => v.decision).length}/${result2.votes.length} approved`);
  console.log(`  Consensus Reached: ${result2.consensusReached ? 'YES' : 'NO'}`);

  // Decision 3: Consensus by specific roles only (validators + risk assessors)
  console.log('\n📝 Decision 3: Security review (validators + risk assessors only)\n');
  const result3 = await coordinator.requestConsensus(
    'approve_security_review',
    { criticalUpdate: true },
    ['validator', 'risk-assessor']
  );

  console.log(`  Result: ${result3.decision ? '✅ APPROVED' : '❌ REJECTED'}`);
  console.log(`  Participating Agents: ${result3.votes.length}`);
  console.log(`  Participation Rate: ${(result3.participationRate * 100).toFixed(1)}%`);

  coordinator.shutdown();
  console.log('\n');
}

/**
 * Scenario 3: Agent Failure & Recovery
 * Shows how the swarm handles agent failures and recovers
 */
async function scenarioFailureRecovery() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 3: Agent Failure & Recovery');
  console.log('═'.repeat(80) + '\n');

  const config: SwarmConfig = {
    name: 'resilient-swarm',
    agents: [
      { role: 'validator', count: 3, votingWeight: 1.0 },
      { role: 'executor', count: 2, votingWeight: 1.0 }
    ],
    consensusThreshold: 0.66,
    timeoutSeconds: 30,
    maxRetries: 3,
    failureRecoveryEnabled: true
  };

  const coordinator = new SwarmCoordinator(config);

  console.log('✅ Swarm initialized with 5 agents\n');

  // Submit a batch of tasks
  console.log('📥 Submitting 3 validation tasks...\n');
  const taskIds = [
    coordinator.submitTask('validate', { tx: 'tx1' }, 5),
    coordinator.submitTask('validate', { tx: 'tx2' }, 5),
    coordinator.submitTask('validate', { tx: 'tx3' }, 5)
  ];

  // Wait a bit for first task to start
  await new Promise(resolve => setTimeout(resolve, 100));

  // Simulate agent failure
  const agents = coordinator.getAgents();
  const validatorId = agents.find(a => a.role === 'validator')?.id;

  if (validatorId) {
    console.log(`⚠️  Simulating failure of agent: ${validatorId}\n`);
    await coordinator.handleAgentFailure(validatorId);
  }

  // Wait for recovery and task completion
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n📊 Post-Recovery Status:\n');
  const metrics = coordinator.getMetrics();
  console.log(`Active Agents: ${metrics.activeAgents}/${metrics.totalAgents}`);
  console.log(`Tasks Completed: ${metrics.completedTasks}/${metrics.totalTasks}`);
  console.log(`Tasks Failed: ${metrics.failedTasks}`);
  console.log(`Success Rate: ${(metrics.consensusSuccessRate * 100).toFixed(1)}%`);

  // Verify all tasks completed despite failure
  console.log('\n🔍 Task Status:');
  taskIds.forEach((taskId, index) => {
    const task = coordinator.getTaskStatus(taskId);
    console.log(`  Task ${index + 1}: ${task?.status || 'unknown'}`);
  });

  coordinator.shutdown();
  console.log('\n');
}

/**
 * Scenario 4: Priority-Based Task Processing
 * Shows how high-priority tasks are processed first
 */
async function scenarioPriorityProcessing() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 4: Priority-Based Task Processing');
  console.log('═'.repeat(80) + '\n');

  const config: SwarmConfig = {
    name: 'priority-swarm',
    agents: [
      { role: 'validator', count: 2, votingWeight: 1.0 },
      { role: 'executor', count: 1, votingWeight: 1.0 }
    ],
    consensusThreshold: 0.66,
    timeoutSeconds: 30,
    maxRetries: 3,
    failureRecoveryEnabled: true
  };

  const coordinator = new SwarmCoordinator(config);

  console.log('📥 Submitting mixed-priority tasks:\n');

  const tasks = [
    { priority: 2, description: 'Low priority: Regular validation' },
    { priority: 10, description: 'HIGH PRIORITY: Critical security check' },
    { priority: 5, description: 'Medium priority: Standard execution' },
    { priority: 1, description: 'Low priority: Background optimization' },
    { priority: 8, description: 'High priority: Fraud detection' }
  ];

  const taskIds: string[] = [];
  tasks.forEach(task => {
    console.log(`  [Priority ${task.priority}] ${task.description}`);
    const id = coordinator.submitTask('validate', { data: task.description }, task.priority);
    taskIds.push(id);
  });

  await new Promise(resolve => setTimeout(resolve, 600));

  console.log('\n📊 Processing Order (based on completion):\n');
  // Note: In concurrent processing, exact order isn't guaranteed,
  // but higher priority tasks should complete earlier on average
  taskIds.forEach((taskId, index) => {
    const task = coordinator.getTaskStatus(taskId);
    console.log(`  ${tasks[index].description}: ${task?.status}`);
  });

  const metrics = coordinator.getMetrics();
  console.log(`\n✅ All tasks completed in ${metrics.averageResponseTime.toFixed(0)}ms average\n`);

  coordinator.shutdown();
  console.log('\n');
}

/**
 * Scenario 5: Real-World Payment Flow
 * Combines all features for a complete payment processing flow
 */
async function scenarioRealWorldPaymentFlow() {
  console.log('═'.repeat(80));
  console.log('SCENARIO 5: Real-World Payment Flow');
  console.log('═'.repeat(80) + '\n');

  const config: SwarmConfig = {
    name: 'production-swarm',
    agents: [
      { role: 'validator', count: 3, votingWeight: 1.0 },
      { role: 'risk-assessor', count: 2, votingWeight: 2.0 },
      { role: 'executor', count: 2, votingWeight: 1.2 },
      { role: 'optimizer', count: 1, votingWeight: 1.0 }
    ],
    consensusThreshold: 0.7,
    timeoutSeconds: 30,
    maxRetries: 3,
    failureRecoveryEnabled: true
  };

  const coordinator = new SwarmCoordinator(config);

  const paymentRequest = {
    from: 'user_alice',
    to: 'merchant_bob',
    amount: 5000,
    currency: 'USDC',
    timestamp: new Date().toISOString()
  };

  console.log('💳 Processing Payment Request:\n');
  console.log(`  From: ${paymentRequest.from}`);
  console.log(`  To: ${paymentRequest.to}`);
  console.log(`  Amount: $${paymentRequest.amount} ${paymentRequest.currency}`);
  console.log(`  Time: ${paymentRequest.timestamp}\n`);

  // Step 1: Validate transaction
  console.log('Step 1: Validation\n');
  const validationTask = coordinator.submitTask('validate', paymentRequest, 9);
  await new Promise(resolve => setTimeout(resolve, 150));
  const validation = coordinator.getTaskStatus(validationTask);
  console.log(`  Status: ${validation?.status}`);
  console.log(`  Result: ${validation?.result ? JSON.stringify(validation.result, null, 2).split('\n').join('\n  ') : 'N/A'}\n`);

  // Step 2: Risk assessment
  console.log('Step 2: Risk Assessment\n');
  const riskTask = coordinator.submitTask('assess_risk', paymentRequest, 8);
  await new Promise(resolve => setTimeout(resolve, 150));
  const riskAssessment = coordinator.getTaskStatus(riskTask);
  console.log(`  Status: ${riskAssessment?.status}`);
  console.log(`  Risk Score: ${riskAssessment?.result?.riskScore?.toFixed(2) || 'N/A'}`);
  console.log(`  Risk Level: ${riskAssessment?.result?.riskLevel || 'N/A'}\n`);

  // Step 3: Consensus for approval
  console.log('Step 3: Swarm Consensus\n');
  const consensus = await coordinator.requestConsensus(
    'approve_payment',
    paymentRequest
  );
  console.log(`  Decision: ${consensus.decision ? '✅ APPROVED' : '❌ REJECTED'}`);
  console.log(`  Confidence: ${(consensus.confidence * 100).toFixed(1)}%`);
  console.log(`  Votes: ${consensus.votes.filter(v => v.decision).length}/${consensus.votes.length}\n`);

  // Step 4: Optimize execution
  if (consensus.decision) {
    console.log('Step 4: Route Optimization\n');
    const optimizationTask = coordinator.submitTask('optimize', paymentRequest, 7);
    await new Promise(resolve => setTimeout(resolve, 150));
    const optimization = coordinator.getTaskStatus(optimizationTask);
    console.log(`  Status: ${optimization?.status}`);
    console.log(`  Optimized Value: $${optimization?.result?.optimizedValue?.toFixed(2) || 'N/A'}`);
    console.log(`  Improvement: ${optimization?.result?.improvement || 0}%\n`);

    // Step 5: Execute payment
    console.log('Step 5: Execution\n');
    const executionTask = coordinator.submitTask('execute', {
      ...paymentRequest,
      optimizedAmount: optimization?.result?.optimizedValue
    }, 10);
    await new Promise(resolve => setTimeout(resolve, 150));
    const execution = coordinator.getTaskStatus(executionTask);
    console.log(`  Status: ${execution?.status}`);
    console.log(`  Transaction Hash: ${execution?.result?.txHash || 'N/A'}`);
    console.log(`  Gas Used: ${execution?.result?.gasUsed || 'N/A'}\n`);

    console.log('✅ Payment Flow Completed Successfully!\n');
  } else {
    console.log('❌ Payment REJECTED by swarm consensus\n');
  }

  // Final metrics
  console.log('📊 Final Metrics:\n');
  const metrics = coordinator.getMetrics();
  console.log(`  Total Agents: ${metrics.totalAgents}`);
  console.log(`  Active Agents: ${metrics.activeAgents}`);
  console.log(`  Tasks Completed: ${metrics.completedTasks}/${metrics.totalTasks}`);
  console.log(`  Success Rate: ${(metrics.consensusSuccessRate * 100).toFixed(1)}%`);
  console.log(`  Average Response Time: ${metrics.averageResponseTime.toFixed(0)}ms`);

  coordinator.shutdown();
  console.log('\n');
}

/**
 * Main demo runner
 */
async function main() {
  console.log('\n');
  console.log('🤖 SWARM COORDINATOR DEMO');
  console.log('Multi-Agent Payment Processing System\n');

  try {
    await scenarioBasicTaskDistribution();
    await scenarioConsensusDecisionMaking();
    await scenarioFailureRecovery();
    await scenarioPriorityProcessing();
    await scenarioRealWorldPaymentFlow();

    console.log('═'.repeat(80));
    console.log('✨ All scenarios completed successfully!');
    console.log('═'.repeat(80) + '\n');
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  scenarioBasicTaskDistribution,
  scenarioConsensusDecisionMaking,
  scenarioFailureRecovery,
  scenarioPriorityProcessing,
  scenarioRealWorldPaymentFlow
};
