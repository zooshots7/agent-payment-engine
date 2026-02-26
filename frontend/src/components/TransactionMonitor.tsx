import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle, Clock } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  from: string
  to: string
  status: 'completed' | 'pending'
  time: string
}

const mockTransactions: Transaction[] = [
  { id: '1', amount: 5240, from: 'Ethereum', to: 'Solana', status: 'completed', time: '2s ago' },
  { id: '2', amount: 1890, from: 'Base', to: 'Arbitrum', status: 'completed', time: '5s ago' },
  { id: '3', amount: 8100, from: 'Polygon', to: 'Ethereum', status: 'pending', time: '8s ago' },
  { id: '4', amount: 3450, from: 'Solana', to: 'Base', status: 'completed', time: '12s ago' },
  { id: '5', amount: 6780, from: 'Arbitrum', to: 'Polygon', status: 'completed', time: '15s ago' },
]

export default function TransactionMonitor() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [transactions] = useState(mockTransactions)

  return (
    <div ref={sectionRef} className="w-full">
      <motion.div
        className="mb-16 md:mb-24 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-purple-900 bg-purple-950/20">
          <span className="text-[11px] font-medium tracking-widest text-purple-500 uppercase">
            LIVE FEED
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-purple-300">
          Transaction Monitor
        </h2>
      </motion.div>

      <div className="mt-24 space-y-8">
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            className="p-8 md:p-12 flex items-center justify-between glow-bg rounded-[2.5rem] hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
          >
            <div className="flex items-center gap-8 flex-1 z-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                {tx.status === 'completed' ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                ) : (
                  <Clock className="w-8 h-8 text-amber-500 animate-pulse" />
                )}
              </div>

              <div className="flex items-center gap-6 md:gap-12">
                <span className="text-xl md:text-2xl font-bold text-purple-300 min-w[100px] text-right">{tx.from}</span>
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                <span className="text-xl md:text-2xl font-bold text-purple-300">{tx.to}</span>
              </div>
            </div>

            <div className="text-right z-10">
              <div className="text-4xl md:text-5xl font-black gradient-purple">${tx.amount.toLocaleString()}</div>
              <div className="text-sm font-bold text-purple-500 uppercase tracking-widest mt-4 md:mt-6">{tx.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
