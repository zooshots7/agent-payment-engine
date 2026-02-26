import { motion } from 'framer-motion'
import { Bell, Shield, Zap, Database } from 'lucide-react'

export default function Settings() {
  const sections = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure alert preferences and notification channels',
      settings: [
        { label: 'Email Notifications', enabled: true },
        { label: 'Slack Integration', enabled: false },
        { label: 'Telegram Alerts', enabled: true },
        { label: 'Critical Alerts Only', enabled: false }
      ]
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Manage security settings and access controls',
      settings: [
        { label: 'Two-Factor Authentication', enabled: true },
        { label: 'API Key Rotation', enabled: true },
        { label: 'IP Whitelist', enabled: false },
        { label: 'Audit Logging', enabled: true }
      ]
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimize system performance and resource usage',
      settings: [
        { label: 'Auto-scaling', enabled: true },
        { label: 'Load Balancing', enabled: true },
        { label: 'Caching', enabled: true },
        { label: 'Rate Limiting', enabled: false }
      ]
    },
    {
      icon: Database,
      title: 'Data & Storage',
      description: 'Configure data retention and backup policies',
      settings: [
        { label: 'Auto Backups', enabled: true },
        { label: 'Data Encryption', enabled: true },
        { label: 'Log Retention (30 days)', enabled: true },
        { label: 'Export Data', enabled: true }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your system configuration and preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, i) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  <p className="text-sm text-slate-400">{section.description}</p>
                </div>
              </div>

              {/* Settings List */}
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{setting.label}</span>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.enabled ? 'bg-blue-500' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">API Endpoint</label>
            <input
              type="text"
              value="https://api.sol-izer.com/v1"
              readOnly
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value="sk_live_1234567890abcdef"
                readOnly
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm"
              />
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                Rotate
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
