import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface HealthData {
  status: string
  services: {
    yieldOptimizer: string
    routeOptimizer: string
    fraudDetector: string
    dynamicPricing: string
    swarmCoordinator: string
    analytics: string
  }
  timestamp: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

export default function SystemHealth() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchHealth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health')
      const data = await response.json()
      setHealth(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch health:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-gray-500 text-sm">Loading system status...</div>
      </section>
    )
  }

  const services = health?.services || {}
  const serviceList = [
    { key: 'yieldOptimizer', label: 'Yield Optimizer', icon: '📈', desc: 'DeFi Protocol Analysis' },
    { key: 'routeOptimizer', label: 'Route Optimizer', icon: '🛣️', desc: 'Cross-Chain Routing' },
    { key: 'fraudDetector', label: 'Fraud Detector', icon: '🛡️', desc: 'Transaction Monitoring' },
    { key: 'dynamicPricing', label: 'Dynamic Pricing', icon: '💰', desc: 'AI Price Optimization' },
    { key: 'swarmCoordinator', label: 'Swarm Coordinator', icon: '🤖', desc: 'Multi-Agent Consensus' },
    { key: 'analytics', label: 'Analytics', icon: '📊', desc: 'Real-Time Insights' }
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-3">System Health</h2>
        <p className="text-gray-400 text-lg">Real-time status of all services</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {serviceList.map((service) => {
          const status = services[service.key as keyof typeof services]
          const isRunning = status === 'running'

          return (
            <motion.div
              key={service.key}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                borderColor: isRunning ? 'rgba(168, 85, 247, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                boxShadow: isRunning 
                  ? '0 20px 50px rgba(168, 85, 247, 0.15)' 
                  : '0 20px 50px rgba(239, 68, 68, 0.15)'
              }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{service.icon}</div>
                <motion.div 
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    isRunning 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                  animate={isRunning ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isRunning ? 'Online' : 'Offline'}
                </motion.div>
              </div>
              
              <h3 className="text-white font-semibold text-lg mb-2">{service.label}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              
              {isRunning && (
                <motion.div 
                  className="mt-4 pt-4 border-t border-gray-800/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>All systems operational</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
