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
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <div className="text-lg font-bold text-white">SOL-IZER</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Payment Engine</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Status */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-700 rounded-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300 font-medium">All Systems Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-8">
          <div className="text-sm text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-white">Admin</div>
              <div className="text-xs text-slate-400">admin@sol-izer.com</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">A</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
