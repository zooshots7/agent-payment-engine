import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, DollarSign, Zap, Users } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const revenueData = [
  { time: '00:00', value: 4200 },
  { time: '04:00', value: 3800 },
  { time: '08:00', value: 6500 },
  { time: '12:00', value: 8900 },
  { time: '16:00', value: 7200 },
  { time: '20:00', value: 9800 },
  { time: '23:59', value: 11200 }
]

const transactionData = [
  { time: '00:00', count: 45 },
  { time: '04:00', count: 32 },
  { time: '08:00', count: 78 },
  { time: '12:00', count: 124 },
  { time: '16:00', count: 156 },
  { time: '20:00', count: 98 },
  { time: '23:59', count: 67 }
]

const agentPerformance = [
  { name: 'Validator', tasks: 234, efficiency: 98 },
  { name: 'Executor', tasks: 189, efficiency: 95 },
  { name: 'Optimizer', tasks: 156, efficiency: 97 },
  { name: 'Risk', tasks: 167, efficiency: 94 },
  { name: 'Coordinator', tasks: 98, efficiency: 99 }
]

export default function DashboardPro() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+24.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      chart: revenueData
    },
    {
      title: 'Transactions',
      value: '1,247',
      change: '+12.3%',
      trend: 'up',
      icon: Activity,
      color: 'blue',
      chart: transactionData
    },
    {
      title: 'Active Agents',
      value: '17',
      change: '100%',
      trend: 'up',
      icon: Users,
      color: 'purple',
      chart: agentPerformance
    },
    {
      title: 'Avg Response',
      value: '12ms',
      change: '-5.3%',
      trend: 'down',
      icon: Zap,
      color: 'yellow',
      chart: transactionData
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Performance Dashboard</h2>
            <p className="text-gray-400 text-lg">Real-time metrics and analytics</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/30"
          >
            Export Report
          </motion.button>
        </div>
        
        {/* Time range selector */}
        <div className="flex items-center gap-2">
          {['24H', '7D', '30D', '90D'].map((range, i) => (
            <motion.button
              key={range}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                i === 0
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
              }`}
            >
              {range}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-${metric.color}-600 to-${metric.color}-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all`} />
            
            {/* Card */}
            <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 group-hover:border-purple-500/50 transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${metric.color}-500/10 rounded-xl`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                  metric.trend === 'up' 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {metric.change}
                </div>
              </div>

              {/* Value */}
              <div className="mb-1">
                <div className="text-3xl font-bold text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-400">
                  {metric.title}
                </div>
              </div>

              {/* Mini chart */}
              <div className="h-16 mt-4 -mb-2 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={i === 0 ? revenueData : transactionData}>
                    <defs>
                      <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={
                          metric.color === 'green' ? '#10b981' :
                          metric.color === 'blue' ? '#3b82f6' :
                          metric.color === 'purple' ? '#a855f7' :
                          '#eab308'
                        } stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={
                          metric.color === 'green' ? '#10b981' :
                          metric.color === 'blue' ? '#3b82f6' :
                          metric.color === 'purple' ? '#a855f7' :
                          '#eab308'
                        } stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey={i === 0 ? 'value' : 'count'}
                      stroke={
                        metric.color === 'green' ? '#10b981' :
                        metric.color === 'blue' ? '#3b82f6' :
                        metric.color === 'purple' ? '#a855f7' :
                        '#eab308'
                      }
                      strokeWidth={2}
                      fill={`url(#gradient-${i})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Revenue Overview</h3>
              <p className="text-sm text-gray-400">Last 24 hours</p>
            </div>
            <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm font-semibold">
              +24.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Agent Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Agent Performance</h3>
              <p className="text-sm text-gray-400">Task completion rates</p>
            </div>
            <div className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm font-semibold">
              97% Avg
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={agentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="tasks" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {recentActivity.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-800/50 hover:border-purple-500/30 transition-all group"
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-purple-500'
              } animate-pulse`} />
              
              <div className="flex-1">
                <p className="text-sm text-gray-200 group-hover:text-white transition-colors">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
              
              <div className="text-xs font-medium text-gray-400 bg-gray-800 px-3 py-1 rounded-lg">
                {activity.agent}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

const recentActivity = [
  { type: 'success', message: 'Yield optimization executed successfully • +2.4% APY', time: '2 minutes ago', agent: 'optimizer-1' },
  { type: 'info', message: 'New route discovered: Solana → Base via Wormhole', time: '5 minutes ago', agent: 'route-optimizer' },
  { type: 'warning', message: 'High velocity detected on wallet 0x7a3f...', time: '8 minutes ago', agent: 'fraud-detector' },
  { type: 'success', message: 'Swarm consensus reached on payment routing', time: '12 minutes ago', agent: 'coordinator-2' },
  { type: 'info', message: 'Dynamic pricing adjusted: $98.50 → $102.30', time: '15 minutes ago', agent: 'pricing-engine' },
  { type: 'success', message: 'Transaction batch processed: 124 payments', time: '18 minutes ago', agent: 'executor-3' }
]
