import { motion } from 'framer-motion'
import { TrendingUp, Activity, DollarSign, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const revenueData = [
  { time: '00:00', value: 4200 },
  { time: '04:00', value: 3800 },
  { time: '08:00', value: 6500 },
  { time: '12:00', value: 8900 },
  { time: '16:00', value: 7200 },
  { time: '20:00', value: 9800 },
  { time: '23:59', value: 11200 }
]

export default function DashboardPro() {
  const metrics = [
    {
      title: 'Total Volume',
      value: '$2.4M',
      change: '+24.5%',
      icon: DollarSign,
      color: 'text-emerald-400'
    },
    {
      title: 'Transactions',
      value: '1,247',
      change: '+12.3%',
      icon: Activity,
      color: 'text-cyan-400'
    },
    {
      title: 'Avg Response',
      value: '12ms',
      change: '-5.3%',
      icon: Zap,
      color: 'text-yellow-400'
    }
  ]

  return (
    <section className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Live Performance</h2>
        <p className="text-gray-400 text-lg font-light">Real-time metrics and analytics</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 bg-white/5 rounded-xl ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${metric.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  <TrendingUp className="w-4 h-4" />
                  {metric.change}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-2">{metric.title}</div>
                <div className="text-3xl font-bold text-white">{metric.value}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
      >
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-2">24-Hour Activity</h3>
          <p className="text-gray-500 text-sm">Transaction volume over time</p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '12px'
              }}
              labelStyle={{ color: '#9ca3af' }}
              itemStyle={{ color: '#8b5cf6' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </section>
  )
}
