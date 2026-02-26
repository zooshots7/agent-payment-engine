import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSick() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/10 via-[#0a0a0a] to-[#0a0a0a]" />
      
      {/* Minimal grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_40%,transparent_100%)]" />
      
      {/* Single subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500/5 backdrop-blur-sm border border-violet-500/10 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-300/80">
              Powered by AI Multi-Agent Technology
            </span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="block text-white/95 mb-3">
                The Future of
              </span>
              <span className="block bg-gradient-to-r from-violet-400 to-violet-600 text-transparent bg-clip-text">
                Payment Orchestration
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              Autonomous AI agents handling yield optimization, fraud detection, 
              and cross-chain routing—all in real-time. Built on Solana.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 transition-all"
            >
              <span className="flex items-center gap-2">
                Launch Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg font-medium text-white transition-all"
            >
              View Documentation
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16 border-t border-white/5"
          >
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">$2.4M+</div>
              <div className="text-sm text-gray-500">Total Volume</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">99.8%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-500">Autonomous</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
