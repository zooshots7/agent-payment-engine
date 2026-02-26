import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Shield, Zap, Database, Copy, Check, RefreshCw, Save } from 'lucide-react'

interface SettingToggle {
  label: string
  enabled: boolean
}

export default function Settings() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [apiKey, setApiKey] = useState('sk_live_1234567890abcdef')
  const [copied, setCopied] = useState(false)
  const [isRotating, setIsRotating] = useState(false)

  const [notifications, setNotifications] = useState<SettingToggle[]>([
    { label: 'Email Notifications', enabled: true },
    { label: 'Slack Integration', enabled: false },
    { label: 'Telegram Alerts', enabled: true },
    { label: 'Critical Alerts Only', enabled: false }
  ])

  const [security, setSecurity] = useState<SettingToggle[]>([
    { label: 'Two-Factor Authentication', enabled: true },
    { label: 'API Key Rotation', enabled: true },
    { label: 'IP Whitelist', enabled: false },
    { label: 'Audit Logging', enabled: true }
  ])

  const [performance, setPerformance] = useState<SettingToggle[]>([
    { label: 'Auto-scaling', enabled: true },
    { label: 'Load Balancing', enabled: true },
    { label: 'Caching', enabled: true },
    { label: 'Rate Limiting', enabled: false }
  ])

  const [data, setData] = useState<SettingToggle[]>([
    { label: 'Auto Backups', enabled: true },
    { label: 'Data Encryption', enabled: true },
    { label: 'Log Retention (30 days)', enabled: true },
    { label: 'Export Data', enabled: true }
  ])

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const toggleSetting = (
    section: 'notifications' | 'security' | 'performance' | 'data',
    index: number
  ) => {
    const setters = {
      notifications: setNotifications,
      security: setSecurity,
      performance: setPerformance,
      data: setData
    }

    const setter = setters[section]
    setter(prev => {
      const newSettings = [...prev]
      newSettings[index] = { ...newSettings[index], enabled: !newSettings[index].enabled }
      showSuccessToast(`${newSettings[index].label} ${newSettings[index].enabled ? 'enabled' : 'disabled'}`)
      return newSettings
    })
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    showSuccessToast('API key copied to clipboard')
  }

  const handleRotateApiKey = async () => {
    setIsRotating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 18)}`
    setApiKey(newKey)
    setIsRotating(false)
    showSuccessToast('API key rotated successfully')
  }

  const handleSaveAll = () => {
    showSuccessToast('All settings saved successfully')
  }

  const sections = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure alert preferences and notification channels',
      gradient: 'from-blue-500 to-cyan-500',
      settings: notifications,
      setter: (i: number) => toggleSetting('notifications', i)
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Manage security settings and access controls',
      gradient: 'from-emerald-500 to-teal-500',
      settings: security,
      setter: (i: number) => toggleSetting('security', i)
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimize system performance and resource usage',
      gradient: 'from-purple-500 to-pink-500',
      settings: performance,
      setter: (i: number) => toggleSetting('performance', i)
    },
    {
      icon: Database,
      title: 'Data & Storage',
      description: 'Configure data retention and backup policies',
      gradient: 'from-orange-500 to-yellow-500',
      settings: data,
      setter: (i: number) => toggleSetting('data', i)
    }
  ]

  return (
    <div className="space-y-8">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-6 z-50"
          >
            <div className="glass-card px-6 py-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                {successMessage}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-slate-400 text-lg">Manage your system configuration and preferences</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveAll}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold">
            <Save className="w-4 h-4" />
            Save All Changes
          </div>
        </motion.button>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, i) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              
              <div className="relative glass-card rounded-2xl p-8">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-3 bg-gradient-to-br ${section.gradient} rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    <p className="text-sm text-slate-400">{section.description}</p>
                  </div>
                </div>

                {/* Settings List */}
                <div className="space-y-5">
                  {section.settings.map((setting, settingIndex) => (
                    <motion.div 
                      key={setting.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + settingIndex * 0.05 }}
                      className="flex items-center justify-between group/item"
                    >
                      <span className="text-sm text-slate-300 font-medium group-hover/item:text-white transition-colors">
                        {setting.label}
                      </span>
                      <button
                        onClick={() => section.setter(settingIndex)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                          setting.enabled 
                            ? `bg-gradient-to-r ${section.gradient}` 
                            : 'bg-slate-600'
                        }`}
                      >
                        <motion.span
                          animate={{ x: setting.enabled ? 24 : 4 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
        <div className="relative glass-card rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-8">API Configuration</h3>
          
          <div className="space-y-6">
            {/* API Endpoint */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">API Endpoint</label>
              <div className="relative">
                <input
                  type="text"
                  value="https://api.sol-izer.com/v1"
                  readOnly
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://api.sol-izer.com/v1')
                    showSuccessToast('Endpoint copied to clipboard')
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">API Key</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="password"
                    value={apiKey}
                    readOnly
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCopyApiKey}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRotateApiKey}
                  disabled={isRotating}
                  className="relative group/rotate"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur-lg opacity-50 group-hover/rotate:opacity-75 transition-opacity" />
                  <div className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-semibold">
                    <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
                    Rotate
                  </div>
                </motion.button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Keep your API key secret. Rotating will invalidate the old key immediately.
              </p>
            </div>

            {/* Rate Limits */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div className="glass-card p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Requests/Hour</div>
                <div className="text-2xl font-bold gradient-text">10,000</div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Burst Limit</div>
                <div className="text-2xl font-bold gradient-text">100/sec</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
