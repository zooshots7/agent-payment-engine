import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react'

export default function Layout() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agents', icon: Users, label: 'Agents' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <div className="text-lg font-bold text-white">SOL-IZER</div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            {/* Status & User */}
            <div className="flex items-center gap-4">
              {/* System Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-slate-300 font-medium">Live</span>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
