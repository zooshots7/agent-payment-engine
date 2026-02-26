import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface FraudStats {
  totalTransactions: number
  flaggedTransactions: number
  blockedTransactions: number
  falsePositiveRate: number
  averageRiskScore: number
}

export default function FraudDetection() {
  const [stats, setStats] = useState<FraudStats | null>(null)
  const [testTx, setTestTx] = useState({
    userId: 'user_123',
    amount: '5000',
    destination: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/fraud/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch fraud stats:', error)
    }
  }

  const checkTransaction = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/fraud/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction: {
            ...testTx,
            amount: parseFloat(testTx.amount),
            timestamp: Date.now()
          }
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Failed to check transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400 bg-green-500/10 border-green-500/20'
    if (score < 70) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    return 'text-red-400 bg-red-500/10 border-red-500/20'
  }

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Low Risk'
    if (score < 70) return 'Medium Risk'
    return 'High Risk'
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
        <h2 className="text-4xl font-bold text-white mb-3">Fraud Detection</h2>
        <p className="text-gray-400 text-lg">AI-powered transaction monitoring and risk assessment</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Total Checked</p>
          <p className="text-2xl font-bold text-white">{stats?.totalTransactions.toLocaleString() || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Flagged</p>
          <p className="text-2xl font-bold text-yellow-400">{stats?.flaggedTransactions || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Blocked</p>
          <p className="text-2xl font-bold text-red-400">{stats?.blockedTransactions || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Avg Risk Score</p>
          <p className="text-2xl font-bold text-green-400">{stats?.averageRiskScore?.toFixed(1) || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Transaction Panel */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Test Transaction</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">User ID</label>
              <input 
                type="text"
                value={testTx.userId}
                onChange={(e) => setTestTx({ ...testTx, userId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Amount (USD)</label>
              <input 
                type="number"
                value={testTx.amount}
                onChange={(e) => setTestTx({ ...testTx, amount: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Destination Address</label>
              <input 
                type="text"
                value={testTx.destination}
                onChange={(e) => setTestTx({ ...testTx, destination: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none font-mono text-sm"
              />
            </div>

            <button
              onClick={checkTransaction}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Analyzing...' : 'Check Transaction'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Analysis Result</h3>
          
          {!result ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              Submit a transaction to see fraud analysis
            </div>
          ) : (
            <div className="space-y-4">
              {/* Risk Score */}
              <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-400">Risk Score</p>
                  <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getRiskColor(result.riskScore)}`}>
                    {getRiskLabel(result.riskScore)}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        result.riskScore < 30 ? 'bg-green-500' :
                        result.riskScore < 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                  <p className="text-center text-2xl font-bold text-white mt-2">{result.riskScore}/100</p>
                </div>
              </div>

              {/* Decision */}
              <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Decision</p>
                <p className={`text-lg font-bold ${
                  result.decision === 'approve' ? 'text-green-400' :
                  result.decision === 'flag' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {result.decision?.toUpperCase()}
                </p>
              </div>

              {/* Flags */}
              {result.flags && result.flags.length > 0 && (
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Warning Flags</p>
                  <div className="space-y-2">
                    {result.flags.map((flag: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-300">{flag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence */}
              {result.confidence && (
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Model Confidence</p>
                    <p className="text-sm font-semibold text-purple-400">{(result.confidence * 100).toFixed(1)}%</p>
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
