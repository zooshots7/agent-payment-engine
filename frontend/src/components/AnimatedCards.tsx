import { motion } from 'framer-motion'
import { Cpu, Shield, Zap, TrendingUp, Activity, Lock } from 'lucide-react'

export default function AnimatedCards() {
  const features = [
    {
      icon: Cpu,
      title: 'AI Multi-Agent System',
      description: '17 autonomous agents working in perfect harmony to optimize every transaction',
      color: 'purple',
      stats: { value: '17', label: 'Active Agents' }
    },
    {
      icon: Shield,
      title: 'Advanced Fraud Detection',
      description: 'Real-time ML-powered analysis catching suspicious patterns before they become problems',
      color: 'green',
      stats: { value: '99.8%', label: 'Accuracy' }
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Average response time of 12ms with intelligent caching and parallel processing',
      color: 'yellow',
      stats: { value: '12ms', label: 'Response Time' }
    },
    {
      icon: TrendingUp,
      title: 'Yield Optimization',
      description: 'Automatically routes funds to highest-yielding protocols across DeFi',
      color: 'blue',
      stats: { value: '14.2%', label: 'Avg APY' }
    },
    {
      icon: Activity,
      title: 'Real-Time Analytics',
      description: 'Live dashboard with comprehensive metrics and predictive insights',
      color: 'red',
      stats: { value: '1,247', label: 'Transactions' }
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      description: 'End-to-end encryption with multi-signature validation on every transaction',
      color: 'indigo',
      stats: { value: '100%', label: 'Secure' }
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
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Powerful Features</span>
        </div>
        
        <h2 className="text-5xl font-bold text-white mb-4">
          Built for the Future
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Enterprise-grade payment infrastructure powered by cutting-edge AI technology
        </p>
      </motion.div>

      {/* Feature Cards - Style 1: Hover Glow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative group"
          >
            {/* Animated border glow */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-${feature.color}-600 to-${feature.color}-400 rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500`} />
            
            {/* Card */}
            <div className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 group-hover:border-transparent transition-all duration-300 h-full">
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Icon */}
              <div className={`relative w-14 h-14 bg-${feature.color}-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
              </div>

              {/* Content */}
              <h3 className="relative text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="relative text-gray-400 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Stats */}
              <div className={`relative flex items-center justify-between pt-4 border-t border-gray-800 group-hover:border-${feature.color}-500/30 transition-colors`}>
                <div>
                  <div className={`text-2xl font-bold text-${feature.color}-400`}>
                    {feature.stats.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {feature.stats.label}
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-gray-600 group-hover:text-gray-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="relative mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                  className={`h-full bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feature Cards - Style 2: Glass Morphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h3 className="text-3xl font-bold text-white mb-8 text-center">Why Choose SOL-IZER?</h3>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {[
          {
            title: 'Automated Yield Farming',
            description: 'Our AI constantly monitors DeFi protocols and automatically rebalances your portfolio for maximum returns',
            metric: '+14.2% APY',
            icon: '🌾'
          },
          {
            title: 'Cross-Chain Intelligence',
            description: 'Seamlessly route payments across 6+ blockchain networks with optimal gas fees and speed',
            metric: '6 Chains',
            icon: '🔗'
          },
          {
            title: 'Predictive Analytics',
            description: 'ML models predict market movements and optimize routing before congestion hits',
            metric: '95% Accuracy',
            icon: '🔮'
          },
          {
            title: 'Instant Settlement',
            description: 'Zero-knowledge proofs enable instant finality while maintaining complete privacy',
            metric: '<1 Second',
            icon: '⚡'
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-purple-600/10" />
            
            {/* Glass effect */}
            <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 group-hover:border-purple-500/50 transition-all">
              {/* Icon */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              {/* Content */}
              <h4 className="text-2xl font-bold text-white mb-3">
                {item.title}
              </h4>
              <p className="text-gray-400 leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Metric badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                <span className="text-sm font-semibold text-purple-300">
                  {item.metric}
                </span>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feature Cards - Style 3: Minimal with Border Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Open Source', desc: 'Fully audited smart contracts', icon: '📖' },
          { title: 'Community Driven', desc: 'DAO governance for all decisions', icon: '🤝' },
          { title: '24/7 Support', desc: 'Expert team always available', icon: '💬' }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative group"
          >
            {/* Animated border */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{ backgroundSize: '200% 200%' }}
            />

            {/* Card */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center group-hover:border-transparent transition-all">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h5 className="text-xl font-semibold text-white mb-2">{item.title}</h5>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
