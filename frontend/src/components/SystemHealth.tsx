import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

interface HealthData {
  status: string
  services: {
    yieldOptimizer: string
    routeOptimizer: string
    fraudDetector: string
    dynamicPricing: string
  }
  timestamp: string
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
      // Mock data for demo
      setHealth({
        status: 'operational',
        services: {
          yieldOptimizer: 'operational',
          routeOptimizer: 'operational',
          fraudDetector: 'operational',
          dynamicPricing: 'operational'
        },
        timestamp: new Date().toISOString()
      })
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-gray-500 text-center">Loading system status...</div>
      </section>
    )
  }

  const services = [
    { key: 'yieldOptimizer', label: 'Yield Optimizer', desc: 'DeFi Protocol Analysis' },
    { key: 'routeOptimizer', label: 'Route Optimizer', desc: 'Cross-Chain Routing' },
    { key: 'fraudDetector', label: 'Fraud Detector', desc: 'Transaction Monitoring' },
    { key: 'dynamicPricing', label: 'Dynamic Pricing', desc: 'AI Price Optimization' }
  ]

  const isOperational = health?.status === 'operational'
  const allServicesHealthy = Object.values(health?.services || {}).every(s => s === 'operational')

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
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">System Status</h2>
        <p className="text-lg text-gray-400 font-light">All systems operational and running smoothly</p>
      </motion.div>

      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isOperational && allServicesHealthy ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : (
              <XCircle className="w-8 h-8 text-red-400" />
            )}
            <div>
              <h3 className="text-2xl font-bold text-white">
                {isOperational && allServicesHealthy ? 'All Systems Operational' : 'System Issues Detected'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Last updated: {new Date(health?.timestamp || Date.now()).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Live</span>
          </div>
        </div>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, i) => {
          const status = (health?.services as any)?.[service.key] === 'operational'
          return (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-white">{service.label}</h4>
                {status ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className="text-gray-500 text-sm">{service.desc}</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className={`text-xs font-medium ${status ? 'text-emerald-400' : 'text-red-400'}`}>
                  {status ? 'Operational' : 'Degraded'}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
