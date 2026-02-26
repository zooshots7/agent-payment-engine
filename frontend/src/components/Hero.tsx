import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Badge */}
        <motion.div variants={item} className="flex justify-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm">
            <motion.div 
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-purple-400">Autonomous Payment Engine</span>
          </div>
        </motion.div>
        
        {/* Heading */}
        <motion.div variants={item} className="space-y-6">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tight leading-none">
            <span className="text-white block mb-2">Agent-Powered</span>
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Payment Orchestration
            </motion.span>
          </h1>
        </motion.div>
        
        {/* Description */}
        <motion.p 
          variants={item}
          className="text-xl text-gray-400 max-w-3xl leading-relaxed"
        >
          Multi-agent AI system for yield optimization, fraud detection, and intelligent routing across blockchain networks.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={item}
          className="flex items-center gap-4 pt-4"
        >
          <motion.button 
            className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(168, 85, 247, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Launch Dashboard
          </motion.button>
          <motion.button 
            className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-gray-200 rounded-xl font-medium transition-colors border border-gray-800"
            whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            View Docs
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={item}
          className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-800/50"
        >
          {[
            { label: 'Active Agents', value: '17', suffix: '' },
            { label: 'Total Volume', value: '2.4', suffix: 'M' },
            { label: 'Transactions', value: '1.2', suffix: 'K' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="space-y-2"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-4xl font-bold text-white">
                {stat.value}<span className="text-purple-500">{stat.suffix}</span>
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
