import { motion } from 'framer-motion'
import { GridBackground, Spotlight } from './ui/GridBackground'
import { TextGradient, TextShine } from './ui/TextGradient'
import { AnimatedCard } from './ui/AnimatedCard'
import { layout, typography, components, animations } from '../lib/utils'

export default function HeroV2() {
  return (
    <GridBackground className="relative overflow-hidden">
      {/* Spotlight effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      
      <section className={`${layout.container.lg} ${layout.section.xl} relative`}>
        <motion.div
          variants={animations.stagger.container}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          {/* Badge */}
          <motion.div variants={animations.stagger.item} className="flex justify-center md:justify-start">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm group hover:bg-purple-500/20 transition-all">
              <motion.div 
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
                Autonomous Payment Engine • Powered by AI
              </span>
            </div>
          </motion.div>
          
          {/* Main Heading */}
          <motion.div variants={animations.stagger.item} className="space-y-6 text-center md:text-left">
            <h1 className={typography.h1}>
              <span className="block mb-4 text-white">Agent-Powered</span>
              <TextGradient
                from="from-purple-400"
                via="via-purple-500"
                to="to-purple-600"
                animated
                className="block font-bold"
              >
                Payment Orchestration
              </TextGradient>
            </h1>
            
            <p className={`${typography.lead} max-w-3xl ${window.innerWidth < 768 ? 'mx-auto' : ''}`}>
              Multi-agent AI system for <TextShine>yield optimization</TextShine>, fraud detection, 
              and intelligent routing across blockchain networks.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={animations.stagger.item}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
          >
            <motion.button 
              className={components.button.primary + " shadow-lg shadow-purple-500/20"}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 50px rgba(168, 85, 247, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span className="flex items-center gap-2">
                Launch Dashboard
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>
            
            <motion.button 
              className={components.button.secondary}
              whileHover={{ 
                scale: 1.05,
                borderColor: '#a855f7'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Docs
              </span>
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={animations.stagger.item}
            className={`${layout.grid.cols3} ${layout.gap.lg} pt-12`}
          >
            {[
              { label: 'Active Agents', value: '17', icon: '🤖', color: 'purple' },
              { label: 'Total Volume', value: '$2.4M', icon: '💰', color: 'green' },
              { label: 'Transactions', value: '1,247', icon: '⚡', color: 'blue' }
            ].map((stat, i) => (
              <AnimatedCard key={i}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{stat.icon}</div>
                  <motion.div
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      stat.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      stat.color === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    Live
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
                
                {/* Animated progress bar */}
                <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      stat.color === 'purple' ? 'bg-purple-500' :
                      stat.color === 'green' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, delay: i * 0.3 }}
                  />
                </div>
              </AnimatedCard>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </GridBackground>
  )
}
