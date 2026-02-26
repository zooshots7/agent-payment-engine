import { motion } from 'framer-motion'
import { Cpu, Shield, Zap, TrendingUp } from 'lucide-react'

export default function AnimatedCards() {
  const features = [
    {
      icon: Cpu,
      title: 'AI Multi-Agent System',
      description: 'Autonomous agents working in perfect harmony to optimize every transaction',
      stats: { value: '17', label: 'Active Agents' }
    },
    {
      icon: Shield,
      title: 'Fraud Detection',
      description: 'Real-time ML analysis catching suspicious patterns before they become problems',
      stats: { value: '99.8%', label: 'Accuracy' }
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Average response time with intelligent caching and parallel processing',
      stats: { value: '12ms', label: 'Response Time' }
    },
    {
      icon: TrendingUp,
      title: 'Yield Optimization',
      description: 'Automatically routes funds to highest-yielding protocols across DeFi',
      stats: { value: '14.2%', label: 'Avg APY' }
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
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Built for Performance
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
          Enterprise-grade payment infrastructure powered by AI technology
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-violet-500/30 transition-all"
            >
              {/* Icon */}
              <div className="mb-6 p-3 bg-violet-500/10 rounded-xl w-fit">
                <Icon className="w-7 h-7 text-violet-400" />
              </div>
              
              {/* Content */}
              <div className="space-y-3 mb-6">
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
              
              {/* Stats */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-white">{feature.stats.value}</div>
                  <div className="text-sm text-gray-500">{feature.stats.label}</div>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
