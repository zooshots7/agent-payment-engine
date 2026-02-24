# 🤖 Agent Templates

This directory contains pre-built and custom agent configurations.

## 📂 Directory Structure

```
agents/
├── templates/        # Pre-built agent templates (ready to use)
│   ├── yield-optimizer.yaml
│   ├── fraud-detector.yaml
│   └── price-negotiator.yaml
└── custom/          # Your custom agent configurations
    └── (create your own .yaml files here)
```

---

## 📦 Pre-Built Templates

### 1. **Yield Optimizer** (`yield-optimizer.yaml`)
- **Type:** Optimizer
- **Purpose:** Automatically moves idle balances to highest-yield DeFi protocols
- **Capabilities:**
  - Yield optimization
  - Service evaluation
  - Payment execution
- **Strategies:** Conservative | Balanced | Aggressive
- **Supported Protocols:** Kamino, Marginfi, Aave

### 2. **Fraud Detector** (`fraud-detector.yaml`)
- **Type:** Risk Assessor
- **Purpose:** ML-powered real-time fraud pattern recognition
- **Capabilities:**
  - Fraud detection
  - Service evaluation
- **Models:** Velocity check, Amount anomaly, Pattern recognition
- **Actions:** Block, Flag & Notify, Log

### 3. **Price Negotiator** (`price-negotiator.yaml`)
- **Type:** Autonomous
- **Purpose:** Agent-to-agent payment negotiation
- **Capabilities:**
  - Price negotiation
  - Service evaluation
  - Payment execution
- **Features:** Dynamic pricing, Competitor analysis, Escrow support

---

## 🛠 Creating Custom Agents

### Basic Template

Create a new YAML file in `agents/custom/`:

```yaml
# My Custom Agent
name: "my-custom-agent"
type: "autonomous"  # autonomous | optimizer | validator | risk-assessor | service-provider

capabilities:
  - negotiate_price
  - evaluate_service
  - execute_payment

rules:
  maxTransaction: 1000  # USDC
  requireApprovalAbove: 500  # USDC (optional)
  allowedChains:
    - solana
    - base

metadata:
  description: "Description of what this agent does"
  version: "1.0.0"
  author: "Your Name"
```

### Required Fields

- **name** (string): Unique agent identifier
- **type** (enum): `autonomous` | `optimizer` | `validator` | `risk-assessor` | `service-provider`
- **capabilities** (array): List of agent capabilities
- **rules.maxTransaction** (number): Maximum transaction amount in USDC

### Optional Fields

- **rules.requireApprovalAbove** (number): Require manual approval above this amount
- **rules.allowedChains** (array): Chains this agent can operate on
- **metadata** (object): Additional information about the agent

### Available Capabilities

- `negotiate_price` - Price negotiation with other agents
- `evaluate_service` - Service quality evaluation
- `execute_payment` - Execute blockchain payments
- `optimize_yield` - Yield optimization strategies
- `detect_fraud` - Fraud pattern detection
- `route_optimize` - Cross-chain route optimization

---

## 🚀 Loading Agents

### Load Single Template

```typescript
import { AgentManager } from '../src/agents/manager.js';

const manager = new AgentManager();
const agent = manager.loadTemplate('yield-optimizer');
```

### Load All Templates

```typescript
const allAgents = manager.loadAllTemplates();
```

### Load Custom Agents

```typescript
const customAgents = manager.loadCustomAgents();
```

### Load from File Path

```typescript
const agent = manager.createAgentFromFile('./agents/custom/my-agent.yaml');
```

---

## 🧪 Testing Your Agent Config

Validate your YAML configuration:

```typescript
import { YAMLLoader } from '../src/utils/yaml-loader.js';

try {
  const config = YAMLLoader.loadAgentConfig('./agents/custom/my-agent.yaml');
  console.log('✅ Valid configuration:', config);
} catch (error) {
  console.error('❌ Invalid configuration:', error.message);
}
```

---

## 📖 Advanced Examples

### Multi-Strategy Yield Optimizer

```yaml
name: "aggressive-yield-hunter"
type: "optimizer"
capabilities:
  - optimize_yield
  - execute_payment
rules:
  maxTransaction: 50000
  requireApprovalAbove: 10000
  allowedChains: [solana, base, ethereum]

strategy:
  enabled: true
  mode: "aggressive"
  minBalanceThreshold: 5000
  rebalanceFrequency: "30m"
  emergencyReserve: 2000
  
  protocols:
    - name: "Kamino"
      weight: 0.3
      riskLevel: "low"
    - name: "Marginfi"
      weight: 0.4
      riskLevel: "medium"
    - name: "Drift"
      weight: 0.3
      riskLevel: "high"
```

### High-Frequency Trader

```yaml
name: "hft-agent"
type: "autonomous"
capabilities:
  - negotiate_price
  - execute_payment
rules:
  maxTransaction: 100
  allowedChains: [solana]

automation:
  enabled: true
  checkInterval: "1s"
  autoExecute: true
  slippageTolerance: 0.1
```

---

## 🔒 Security Best Practices

1. **Set Appropriate Limits:** Always configure `maxTransaction` and `requireApprovalAbove`
2. **Chain Restrictions:** Use `allowedChains` to limit where agents can operate
3. **Testing:** Test custom agents in sandbox mode before production
4. **Audit Logs:** Enable logging for all agent actions
5. **Version Control:** Keep agent configs in git for change tracking

---

## 📝 Schema Reference

Full TypeScript schema: `src/types/agent.ts`

```typescript
interface AgentConfig {
  name: string;
  type: 'autonomous' | 'optimizer' | 'validator' | 'risk-assessor' | 'service-provider';
  wallet?: string;
  capabilities: AgentCapability[];
  rules: {
    maxTransaction: number;
    requireApprovalAbove?: number;
    allowedChains?: string[];
  };
  metadata?: Record<string, unknown>;
}
```

---

## 🤝 Contributing Templates

Have a useful agent template? Submit a PR to add it to the `templates/` directory!

---

**Built with ✨ by Aviral**
