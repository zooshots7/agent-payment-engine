import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Agent {
  id: string
  role: string
  status: string
  tasksCompleted: number
  uptime: string
  votingWeight: number
}

const performanceData = [
  { role: 'Validator', completed: 234, failed: 12, pending: 8 },
  { role: 'Executor', completed: 189, failed: 8, pending: 5 },
  { role: 'Optimizer', completed: 156, failed: 4, pending: 3 },
  { role: 'Risk', completed: 167, failed: 15, pending: 6 },
  { role: 'Coordinator', completed: 98, failed: 2, pending: 1 }
]

export default function AgentSwarm() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
    fetchMetrics()
    const interval = setInterval(() => {
      fetchAgents()
      fetchMetrics()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/swarm/agents')
      const data = await response.json()
      setAgents(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch agents:', error)
      setLoading(false)
    }
  }

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/swarm/metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    }
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-gray-500 text-sm">Loading agent swarm...</div>
      </section>
    )
  }

  const getRoleIcon = (role: string) => {
    const icons: Record<string, string> = {
      'validator': '✓',
      'executor': '⚡',
      'optimizer': '🎯',
      'risk-assessor': '🛡️',
      'coordinator': '👑'
    }
    return icons[role] || '🤖'
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'validator': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      'executor': 'bg-green-500/10 border-green-500/30 text-green-400',
      'optimizer': 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      'risk-assessor': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      'coordinator': 'bg-red-500/10 border-red-500/30 text-red-400'
    }
    return colors[role] || 'bg-gray-500/10 border-gray-500/30 text-gray-400'
  }

  const groupedAgents = agents.reduce((acc, agent) => {
    if (!acc[agent.role]) acc[agent.role] = []
    acc[agent.role].push(agent)
    return acc
  }, {} as Record<string, Agent[]>)

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-3">Agent Swarm</h2>
        <p className="text-gray-400 text-lg">Multi-agent coordination and consensus system</p>
      </motion.div>

      {/* Swarm Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Total Agents</p>
          <p className="text-2xl font-bold text-white">{agents.length}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Active Tasks</p>
          <p className="text-2xl font-bold text-purple-400">{metrics?.activeTasks || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Consensus Rate</p>
          <p className="text-2xl font-bold text-green-400">{metrics?.consensusRate || 0}%</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Avg Response</p>
          <p className="text-2xl font-bold text-white">{metrics?.avgResponseTime || '0ms'}</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Agent Performance by Role</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="role" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }} />
            <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
            <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[8, 8, 0, 0]} />
            <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Grid by Role */}
      <div className="space-y-6">
        {Object.entries(groupedAgents).map(([role, roleAgents]) => (
          <div key={role} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{getRoleIcon(role)}</span>
              <div>
                <h3 className="text-lg font-semibold text-white capitalize">
                  {role.replace('-', ' ')} Agents
                </h3>
                <p className="text-xs text-gray-400">{roleAgents.length} active</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {roleAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`border rounded-lg p-4 ${getRoleColor(agent.role)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-mono text-xs text-gray-400">{agent.id}</div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Tasks</span>
                      <span className="font-semibold">{agent.tasksCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Weight</span>
                      <span className="font-semibold">{agent.votingWeight.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Uptime</span>
                      <span className="font-semibold">{agent.uptime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Consensus Decisions */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Consensus Decisions</h3>
        
        <div className="space-y-3">
          {recentDecisions.map((decision, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-800/50">
              <div className="flex-1">
                <p className="text-sm text-gray-200 font-medium mb-1">{decision.proposal}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Votes: {decision.votesFor}/{decision.totalVotes}</span>
                  <span>Threshold: {decision.threshold}%</span>
                  <span>{decision.time}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-md text-xs font-medium border ${
                decision.outcome === 'approved' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {decision.outcome.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const recentDecisions = [
  { proposal: 'Execute yield rebalancing to Kamino', votesFor: 14, totalVotes: 17, threshold: 66, outcome: 'approved', time: '2 mins ago' },
  { proposal: 'Approve high-risk transaction 0x7a3f...', votesFor: 9, totalVotes: 17, threshold: 66, outcome: 'rejected', time: '8 mins ago' },
  { proposal: 'Switch bridge provider to Wormhole', votesFor: 16, totalVotes: 17, threshold: 66, outcome: 'approved', time: '15 mins ago' },
  { proposal: 'Increase dynamic pricing by 12%', votesFor: 12, totalVotes: 17, threshold: 66, outcome: 'approved', time: '28 mins ago' }
]
