import { motion } from 'framer-motion'

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'agents', label: 'Agents' },
    { id: 'docs', label: 'Docs' }
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">SOL-IZER</span>
            </span>
          </div>
        </motion.div>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Status */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">Live</span>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
