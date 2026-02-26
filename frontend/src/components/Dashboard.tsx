import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Stats {
  totalTransactions: number
  totalVolume: string
  activeAgents: number
  avgResponseTime: string
}

const transactionData = [
  { time: '00:00', transactions: 45, volume: 89000 },
  { time: '04:00', transactions: 32, volume: 62000 },
  { time: '08:00', transactions: 78, volume: 156000 },
  { time: '12:00', transactions: 124, volume: 248000 },
  { time: '16:00', transactions: 156, volume: 312000 },
  { time: '20:00', transactions: 98, volume: 196000 },
  { time: '23:59', transactions: 67, volume: 134000 }
]

export default function Dashboard() {
  const [stats] = useState<Stats>({
    totalTransactions: 1247,
    totalVolume: '$2.4M',
    activeAgents: 17,
    avgResponseTime: '12ms'
  })

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-3">Performance Overview</h2>
        <p className="text-gray-400 text-lg">Last 24 hours</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          change="+12.5%"
          positive
        />
        <StatCard
          label="Total Volume"
          value={stats.totalVolume}
          change="+8.2%"
          positive
        />
        <StatCard
          label="Active Agents"
          value={stats.activeAgents.toString()}
          change="100%"
          positive
        />
        <StatCard
          label="Avg Response Time"
          value={stats.avgResponseTime}
          change="-5.3%"
          positive
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Transaction Volume Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={transactionData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stroke="#a855f7" 
                strokeWidth={2}
                fill="url(#colorVolume)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Count Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Transaction Count</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-black/30 rounded-lg border border-gray-800/50">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-purple-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-200">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
              </div>
              <div className="text-xs font-medium text-gray-400">{activity.agent}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ label, value, change, positive }: {
  label: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-purple-500/30 transition-all">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold text-white mb-2">{value}</p>
      <p className={`text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change} from yesterday
      </p>
    </div>
  )
}

const recentActivity = [
  { type: 'success', message: 'Yield optimization executed successfully', time: '2 minutes ago', agent: 'optimizer-1' },
  { type: 'info', message: 'New route discovered: Solana → Base via Wormhole', time: '5 minutes ago', agent: 'route-optimizer' },
  { type: 'warning', message: 'High velocity detected on wallet 0x7a3f...', time: '8 minutes ago', agent: 'fraud-detector' },
  { type: 'success', message: 'Swarm consensus reached on payment routing', time: '12 minutes ago', agent: 'coordinator-2' },
  { type: 'info', message: 'Dynamic pricing adjusted: $98.50 → $102.30', time: '15 minutes ago', agent: 'pricing-engine' }
]
