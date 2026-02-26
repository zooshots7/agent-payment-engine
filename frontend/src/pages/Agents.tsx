import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react'
import { getAgents, type Agent } from '../services/mockData'

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    setAgents(getAgents())
    
    const interval = setInterval(() => {
      setAgents(getAgents())
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          icon: CheckCircle2, 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/30',
          glow: 'glow-emerald'
        }
      case 'idle':
        return { 
          icon: Clock, 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30',
          glow: ''
        }
      case 'error':
        return { 
          icon: AlertCircle, 
          color: 'text-red-400', 
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          glow: ''
        }
      default:
        return { 
          icon: Clock, 
          color: 'text-slate-400', 
          bg: 'bg-slate-500/20',
          border: 'border-slate-500/30',
          glow: ''
        }
    }
  }

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'optimizer':
        return 'from-blue-500 to-cyan-500'
      case 'security':
        return 'from-emerald-500 to-teal-500'
      case 'pricing':
        return 'from-purple-500 to-pink-500'
      default:
        return 'from-slate-500 to-slate-600'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">AI Agent Fleet</h1>
          <p className="text-slate-400 text-lg">Autonomous agents optimizing your payment infrastructure</p>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50" />
          <div className="relative glass-card px-6 py-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-slate-400">Active Agents</div>
                <div className="text-2xl font-bold gradient-text">{agents.filter(a => a.status === 'active').length}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent, i) => {
          const statusConfig = getStatusConfig(agent.status)
          const StatusIcon = statusConfig.icon
          const gradient = getTypeGradient(agent.type)
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              {/* Glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              {/* Card */}
              <div className="relative glass-card rounded-2xl p-8 overflow-hidden hover-scale">
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-10`} />
                
                {/* Header */}
                <div className="relative z-10 flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg ${agent.status === 'active' ? statusConfig.glow : ''}`}>
                      <span className="text-white font-bold text-2xl">{agent.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                        {agent.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${statusConfig.bg} border ${statusConfig.border}`}>
                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                    <span className={`text-xs font-semibold ${statusConfig.color} capitalize`}>{agent.status}</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="relative z-10 grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Tasks</div>
                    <div className="text-2xl font-bold gradient-text">{agent.tasksCompleted.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Success</div>
                    <div className="text-2xl font-bold text-emerald-400">{agent.successRate}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Response</div>
                    <div className="text-2xl font-bold text-blue-400">{agent.avgResponseTime}ms</div>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Performance</span>
                    <span className="text-white font-semibold">{agent.successRate}%</span>
                  </div>
                  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.successRate}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${gradient} rounded-full`}
                      style={{ 
                        boxShadow: `0 0 10px ${agent.successRate > 95 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(59, 130, 246, 0.5)'}` 
                      }}
                    />
                  </div>
                </div>

                {/* Last Active */}
                <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Last active</span>
                    <span className="text-slate-400 font-medium">{new Date(agent.lastActive).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Shimmer */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Fleet Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
        <div className="relative glass-card rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-8">Fleet Performance Overview</h3>
          <div className="space-y-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getTypeGradient(agent.type)} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{agent.name[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">{agent.tasksCompleted.toLocaleString()} tasks</span>
                    <span className="text-sm font-bold text-white">{agent.successRate}%</span>
                  </div>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.successRate}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getTypeGradient(agent.type)} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
