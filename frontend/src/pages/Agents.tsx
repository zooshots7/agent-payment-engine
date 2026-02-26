import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { getAgents, type Agent } from '../services/mockData'

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    setAgents(getAgents())
    
    // Update agent data every 3 seconds
    const interval = setInterval(() => {
      setAgents(getAgents())
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case 'idle':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'optimizer':
        return 'bg-blue-500/20 text-blue-400'
      case 'security':
        return 'bg-emerald-500/20 text-emerald-400'
      case 'pricing':
        return 'bg-purple-500/20 text-purple-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Agents</h1>
          <p className="text-slate-400">Monitor and manage your autonomous agent fleet</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg">
            <span className="text-sm text-slate-400">Active: </span>
            <span className="text-lg font-semibold text-white">{agents.filter(a => a.status === 'active').length}</span>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{agent.name[0]}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(agent.type)}`}>
                    {agent.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(agent.status)}
                <span className="text-sm text-slate-400 capitalize">{agent.status}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Tasks</div>
                <div className="text-xl font-bold text-white">{agent.tasksCompleted.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Success Rate</div>
                <div className="text-xl font-bold text-emerald-400">{agent.successRate}%</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Avg Response</div>
                <div className="text-xl font-bold text-blue-400">{agent.avgResponseTime}ms</div>
              </div>
            </div>

            {/* Last Active */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-xs text-slate-500">
                Last active: {new Date(agent.lastActive).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agent Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{agent.name}</span>
                  <span className="text-sm font-medium text-white">{agent.successRate}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${agent.successRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
