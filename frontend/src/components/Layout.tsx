import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, BarChart3, Settings, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Layout() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agents', icon: Users, label: 'Agents' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f172a] to-[#1e1b4b]">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 right-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Premium Top Navigation Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 glass-card border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg glow-blue">
                  <Zap className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl blur-xl opacity-50 animate-pulse" />
              </div>
              <div>
                <div className="text-xl font-bold gradient-text">SOL-IZER</div>
                <div className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Payment Engine</div>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-2">
              {navItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                  >
                    {({ isActive }) => (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium group ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                            style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'drop-shadow-glow' : ''}`} />
                        <span className="relative z-10">{item.label}</span>
                        
                        {!isActive && (
                          <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </motion.div>
                    )}
                  </NavLink>
                )
              })}
            </nav>

            {/* Status & User */}
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* System Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="status-dot bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-semibold">All Systems Operational</span>
              </div>

              {/* User Avatar */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg cursor-pointer glow-blue"
              >
                <span className="text-white font-semibold text-sm">A</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <Outlet />
      </main>

      {/* Bottom Gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent pointer-events-none" />
    </div>
  )
}
