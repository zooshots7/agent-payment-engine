import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PricingMetrics {
  currentPrice: number
  basePrice: number
  priceChange: number
  totalRevenue: number
  conversionRate: number
  avgTransactionValue: number
}

const priceHistory = [
  { time: '00:00', price: 98.5 },
  { time: '04:00', price: 102.3 },
  { time: '08:00', price: 105.8 },
  { time: '12:00', price: 108.2 },
  { time: '16:00', price: 103.4 },
  { time: '20:00', price: 106.7 },
  { time: '23:59', price: 109.3 }
]

export default function PricingAnalytics() {
  const [metrics, setMetrics] = useState<PricingMetrics | null>(null)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    fetchCurrentPrice()
    const interval = setInterval(() => {
      fetchMetrics()
      fetchCurrentPrice()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pricing/metrics')
      const data = await response.json()
      setMetrics(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch pricing metrics:', error)
      setLoading(false)
    }
  }

  const fetchCurrentPrice = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pricing/current')
      const data = await response.json()
      setCurrentPrice(data.price)
    } catch (error) {
      console.error('Failed to fetch current price:', error)
    }
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-gray-500 text-sm">Loading pricing analytics...</div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-3">Dynamic Pricing</h2>
        <p className="text-gray-400 text-lg">AI-driven price optimization and analytics</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Current Price Display */}
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-xl p-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Current Price</p>
            <p className="text-5xl font-bold text-white mb-2">
              ${currentPrice?.toFixed(2) || '0.00'}
            </p>
            {metrics && (
              <p className={`text-sm font-medium ${
                metrics.priceChange > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {metrics.priceChange > 0 ? '+' : ''}{metrics.priceChange.toFixed(2)}% from base price
              </p>
            )}
          </div>
        </div>

        {/* Price Trend Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">24h Price Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#a855f7" 
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Base Price</p>
          <p className="text-2xl font-bold text-white">${metrics?.basePrice.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-green-400">${metrics?.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Conversion Rate</p>
          <p className="text-2xl font-bold text-purple-400">{metrics?.conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Price Factors */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Pricing Factors</h3>
        
        <div className="space-y-4">
          {pricingFactors.map((factor, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{factor.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-white">{factor.name}</p>
                    <p className="text-xs text-gray-400">{factor.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    factor.impact > 0 ? 'text-green-400' : 
                    factor.impact < 0 ? 'text-red-400' : 
                    'text-gray-400'
                  }`}>
                    {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">Weight: {(factor.weight * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    factor.impact > 0 ? 'bg-green-500' : 
                    factor.impact < 0 ? 'bg-red-500' : 
                    'bg-gray-600'
                  }`}
                  style={{ width: `${Math.abs(factor.impact) * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Adjustments */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Price Adjustments</h3>
        
        <div className="space-y-3">
          {recentAdjustments.map((adjustment, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800/50">
              <div>
                <p className="text-sm text-gray-200">{adjustment.reason}</p>
                <p className="text-xs text-gray-500 mt-0.5">{adjustment.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-300">
                  ${adjustment.oldPrice.toFixed(2)} → ${adjustment.newPrice.toFixed(2)}
                </p>
                <p className={`text-xs font-semibold ${
                  adjustment.change > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {adjustment.change > 0 ? '+' : ''}{adjustment.change.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const pricingFactors = [
  { name: 'Demand', icon: '📈', description: 'Current market demand', impact: 8.5, weight: 0.3 },
  { name: 'Competition', icon: '⚔️', description: 'Competitor pricing', impact: -3.2, weight: 0.25 },
  { name: 'Time of Day', icon: '⏰', description: 'Peak vs off-peak', impact: 5.1, weight: 0.2 },
  { name: 'Capacity', icon: '🔋', description: 'System capacity utilization', impact: 2.3, weight: 0.25 }
]

const recentAdjustments = [
  { reason: 'High demand detected', oldPrice: 98.50, newPrice: 105.20, change: 6.8, time: '5 minutes ago' },
  { reason: 'Competitor price drop', oldPrice: 105.20, newPrice: 102.30, change: -2.8, time: '15 minutes ago' },
  { reason: 'Peak hours adjustment', oldPrice: 100.00, newPrice: 98.50, change: -1.5, time: '32 minutes ago' },
  { reason: 'Capacity optimization', oldPrice: 102.00, newPrice: 100.00, change: -2.0, time: '1 hour ago' }
]
