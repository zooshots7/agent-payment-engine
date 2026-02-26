import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Activity, DollarSign, Clock, ArrowUp, ArrowDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getDashboardMetrics, getRecentTransactions, type Transaction } from '../services/mockData'

export default function Dashboard() {
  const [metrics, setMetrics] = useState(getDashboardMetrics())
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    setTransactions(getRecentTransactions(8))
    
    const interval = setInterval(() => {
      setMetrics(getDashboardMetrics())
      setTransactions(getRecentTransactions(8))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      label: 'Total Volume',
      value: `$${(metrics.totalVolume / 1000000).toFixed(2)}M`,
      change: '+24.5%',
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'glow-blue'
    },
    {
      label: 'Transactions',
      value: metrics.totalTransactions.toLocaleString(),
      change: '+12.3%',
      icon: Activity,
      gradient: 'from-purple-500 to-pink-500',
      glow: 'glow-purple'
    },
    {
      label: 'Success Rate',
      value: `${metrics.successRate}%`,
      change: '+0.5%',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'glow-emerald'
    },
    {
      label: 'Avg Response',
      value: `${metrics.avgResponseTime}ms`,
      change: '-2.1%',
      icon: Clock,
      gradient: 'from-orange-500 to-yellow-500',
      glow: 'glow-cyan'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-400 text-lg">Real-time overview of your payment infrastructure</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          const isPositive = stat.change.startsWith('+')
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              {/* Card */}
              <div className="relative glass-card rounded-2xl p-6 overflow-hidden hover-scale">
                {/* Gradient Orb */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl ${stat.glow}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      <span className="text-xs font-semibold">{stat.change}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative glass-card rounded-2xl p-8 hover-scale">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Revenue Stream</h3>
                <p className="text-sm text-slate-400">Last 24 hours</p>
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-sm font-semibold">
                Live
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={metrics.hourlyRevenue}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).getHours() + 'h'}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    borderRadius: '12px',
                    padding: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="url(#lineGradient)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Agent Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative glass-card rounded-2xl p-8 hover-scale">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Agent Activity</h3>
                <p className="text-sm text-slate-400">Last 24 hours</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-dot bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-semibold">{metrics.activeAgents} Active</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={metrics.agentActivity}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).getHours() + 'h'}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    borderRadius: '12px',
                    padding: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  itemStyle={{ color: '#10b981', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="url(#activityLineGradient)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#activityGradient)" 
                />
                <defs>
                  <linearGradient id="activityLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981"/>
                    <stop offset="100%" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
        <div className="relative glass-card rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Recent Transactions</h3>
                <p className="text-sm text-slate-400">Real-time payment activity</p>
              </div>
              <div className="status-dot bg-blue-400" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 text-slate-400 text-sm">
                  <th className="text-left px-8 py-4 font-semibold">Transaction ID</th>
                  <th className="text-left px-8 py-4 font-semibold">Amount</th>
                  <th className="text-left px-8 py-4 font-semibold">Chain</th>
                  <th className="text-left px-8 py-4 font-semibold">Status</th>
                  <th className="text-left px-8 py-4 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx, i) => (
                  <motion.tr 
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-8 py-4 text-sm text-slate-300 font-mono">{tx.id.slice(0, 16)}...</td>
                    <td className="px-8 py-4 text-sm font-bold text-white">${tx.amount.toLocaleString()}</td>
                    <td className="px-8 py-4 text-sm text-slate-400">{tx.chain}</td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-400">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
