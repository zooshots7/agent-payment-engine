import { useState } from 'react'
import { motion } from 'framer-motion'

export default function RouteOptimizer() {
  const [fromChain, setFromChain] = useState('solana')
  const [toChain, setToChain] = useState('ethereum')
  const [amount, setAmount] = useState('1000')
  const [loading, setLoading] = useState(false)
  const [route, setRoute] = useState<any>(null)

  const chains = [
    { id: 'solana', name: 'Solana', icon: '◎' },
    { id: 'ethereum', name: 'Ethereum', icon: 'Ξ' },
    { id: 'base', name: 'Base', icon: '🔵' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
    { id: 'polygon', name: 'Polygon', icon: '🟣' },
    { id: 'optimism', name: 'Optimism', icon: '🔴' }
  ]

  const findRoute = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/route/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromChain,
          toChain,
          amount: parseFloat(amount),
          strategy: 'balanced'
        })
      })
      const data = await response.json()
      setRoute(data)
    } catch (error) {
      console.error('Failed to find route:', error)
    } finally {
      setLoading(false)
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
        <h2 className="text-4xl font-bold text-white mb-3">Route Optimizer</h2>
        <p className="text-gray-400 text-lg">Find optimal cross-chain payment routes</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Configure Route</h3>
          
          <div className="space-y-4">
            {/* From Chain */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">From Chain</label>
              <select 
                value={fromChain}
                onChange={(e) => setFromChain(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              >
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.icon} {chain.name}
                  </option>
                ))}
              </select>
            </div>

            {/* To Chain */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">To Chain</label>
              <select 
                value={toChain}
                onChange={(e) => setToChain(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              >
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.icon} {chain.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Amount (USD)</label>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Find Route Button */}
            <button
              onClick={findRoute}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Finding Route...' : 'Find Optimal Route'}
            </button>
          </div>
        </div>

        {/* Result Panel */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Route Result</h3>
          
          {!route ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              Configure parameters and click "Find Optimal Route"
            </div>
          ) : (
            <div className="space-y-4">
              {/* Route Path */}
              <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Route Path</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {route.path?.map((step: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-white font-medium">{step}</span>
                      {i < route.path.length - 1 && (
                        <span className="text-purple-500">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Total Cost</p>
                  <p className="text-xl font-bold text-white">${route.totalCost?.toFixed(2)}</p>
                </div>
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Est. Time</p>
                  <p className="text-xl font-bold text-white">{route.estimatedTime}</p>
                </div>
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Bridge</p>
                  <p className="text-xl font-bold text-white capitalize">{route.bridge}</p>
                </div>
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Strategy</p>
                  <p className="text-xl font-bold text-white capitalize">{route.strategy}</p>
                </div>
              </div>

              {/* Security Score */}
              {route.securityScore && (
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Security Score</p>
                    <p className="text-sm font-semibold text-green-400">{route.securityScore}/100</p>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${route.securityScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
