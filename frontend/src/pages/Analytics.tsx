import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Shield, Route } from 'lucide-react'
import { getAnalyticsData } from '../services/mockData'

export default function Analytics() {
  const [analytics] = useState(getAnalyticsData())

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">Detailed insights into system performance and optimization</p>
      </div>

      {/* Yield Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Yield Optimization</h2>
            <p className="text-sm text-slate-400">DeFi protocol performance</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Current APY</div>
            <div className="text-3xl font-bold text-emerald-400">{analytics.yieldPerformance.currentAPY}%</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Average APY</div>
            <div className="text-3xl font-bold text-blue-400">{analytics.yieldPerformance.avgAPY}%</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Earned</div>
            <div className="text-3xl font-bold text-white">${analytics.yieldPerformance.totalEarned.toLocaleString()}</div>
          </div>
        </div>

        {/* Protocol Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Protocol Allocation</h3>
          {analytics.yieldPerformance.protocols.map((protocol) => (
            <div key={protocol.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-300">{protocol.name}</span>
                  <span className="text-xs text-emerald-400">{protocol.apy}% APY</span>
                </div>
                <div className="text-sm text-slate-400">
                  ${protocol.tvl.toLocaleString()} · {protocol.allocation}%
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
                  style={{ width: `${protocol.allocation}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Fraud Detection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Fraud Detection</h2>
            <p className="text-sm text-slate-400">Security and risk analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-slate-400 mb-1">Total Scanned</div>
            <div className="text-2xl font-bold text-white">{analytics.fraudDetection.totalScanned.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">Flagged</div>
            <div className="text-2xl font-bold text-yellow-400">{analytics.fraudDetection.flagged}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">Blocked</div>
            <div className="text-2xl font-bold text-red-400">{analytics.fraudDetection.blocked}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">False Positives</div>
            <div className="text-2xl font-bold text-emerald-400">{analytics.fraudDetection.falsePositives}</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Average Risk Score</span>
            <span className="text-lg font-semibold text-emerald-400">{(analytics.fraudDetection.avgRiskScore * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${analytics.fraudDetection.avgRiskScore * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Route Optimization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Route className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Route Optimization</h2>
            <p className="text-sm text-slate-400">Cross-chain routing efficiency</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Routes</div>
            <div className="text-3xl font-bold text-white">{analytics.routeOptimization.totalRoutes.toLocaleString()}</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Avg Savings</div>
            <div className="text-3xl font-bold text-emerald-400">{analytics.routeOptimization.avgSavings}%</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Saved</div>
            <div className="text-3xl font-bold text-blue-400">${analytics.routeOptimization.totalSaved.toLocaleString()}</div>
          </div>
        </div>

        {/* Chain Usage */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Chain Usage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.routeOptimization.chains.map((chain) => (
              <div key={chain.name} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{chain.name}</span>
                  <span className="text-xs text-slate-400">{chain.usage}% usage</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Avg Cost</span>
                  <span className="text-sm font-semibold text-blue-400">${chain.avgCost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
