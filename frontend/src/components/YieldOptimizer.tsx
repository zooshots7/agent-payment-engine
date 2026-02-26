import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Protocol {
  name: string
  apy: number
  tvl: number
  risk: string
  allocation?: number
}

interface YieldData {
  protocols: Protocol[]
  totalApy: number
  totalAllocated: number
}

export default function YieldOptimizer() {
  const [yieldData, setYieldData] = useState<YieldData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchYieldData()
    const interval = setInterval(fetchYieldData, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchYieldData = async () => {
    try {
      const [allocation, protocols] = await Promise.all([
        fetch('http://localhost:3001/api/yield/allocation').then(r => r.json()),
        fetch('http://localhost:3001/api/yield/protocols').then(r => r.json())
      ])

      const enrichedProtocols = protocols.map((p: Protocol) => ({
        ...p,
        allocation: allocation[p.name] || 0
      }))

      setYieldData({
        protocols: enrichedProtocols,
        totalApy: allocation.expectedApy || 0,
        totalAllocated: allocation.totalAllocated || 0
      })
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch yield data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-gray-500 text-sm">Loading yield optimizer...</div>
      </section>
    )
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getBarColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return '#10b981'
      case 'medium': return '#f59e0b'
      case 'high': return '#ef4444'
      default: return '#6b7280'
    }
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
        <h2 className="text-4xl font-bold text-white mb-3">Yield Optimizer</h2>
        <p className="text-gray-400 text-lg">AI-powered yield allocation across DeFi protocols</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Expected APY</p>
          <p className="text-3xl font-bold text-purple-400">{yieldData?.totalApy.toFixed(2)}%</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Total Allocated</p>
          <p className="text-3xl font-bold text-white">${(yieldData?.totalAllocated || 0).toLocaleString()}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Active Protocols</p>
          <p className="text-3xl font-bold text-white">{yieldData?.protocols.length || 0}</p>
        </div>
      </div>

      {/* APY Comparison Chart */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">APY Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yieldData?.protocols || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any) => [`${value.toFixed(2)}%`, 'APY']}
            />
            <Bar dataKey="apy" radius={[8, 8, 0, 0]}>
              {yieldData?.protocols.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.risk)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Protocol Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Protocol</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">APY</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">TVL</th>
                <th className="text-center px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Risk</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {yieldData?.protocols.map((protocol, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{protocol.name}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-green-400 font-semibold">{protocol.apy.toFixed(1)}%</span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-300">
                    ${(protocol.tvl / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRiskColor(protocol.risk)}`}>
                      {protocol.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(protocol.allocation || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-300 w-12 text-right">
                        {((protocol.allocation || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
