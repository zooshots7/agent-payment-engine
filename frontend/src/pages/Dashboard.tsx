import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Activity, DollarSign, Clock } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getDashboardMetrics, getRecentTransactions, type Transaction } from '../services/mockData'

export default function Dashboard() {
  const [metrics, setMetrics] = useState(getDashboardMetrics())
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    setTransactions(getRecentTransactions(8))
    
    // Update metrics every 5 seconds
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
      color: 'text-emerald-400'
    },
    {
      label: 'Transactions',
      value: metrics.totalTransactions.toLocaleString(),
      change: '+12.3%',
      icon: Activity,
      color: 'text-blue-400'
    },
    {
      label: 'Success Rate',
      value: `${metrics.successRate}%`,
      change: '+0.5%',
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      label: 'Avg Response',
      value: `${metrics.avgResponseTime}ms`,
      change: '-2.1%',
      icon: Clock,
      color: 'text-yellow-400'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Real-time overview of your payment infrastructure</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-slate-700 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Revenue (24h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={metrics.hourlyRevenue}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="timestamp" 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => new Date(value).getHours() + ':00'}
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
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#revenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Agent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Agent Activity (24h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics.agentActivity}>
              <XAxis 
                dataKey="timestamp" 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => new Date(value).getHours() + ':00'}
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
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50 text-slate-400 text-sm">
                <th className="text-left px-6 py-3 font-medium">ID</th>
                <th className="text-left px-6 py-3 font-medium">Amount</th>
                <th className="text-left px-6 py-3 font-medium">Chain</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{tx.id.slice(0, 16)}...</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">${tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{tx.chain}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
