// Color utility functions for static Tailwind classes

export const getTextColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    emerald: 'text-emerald-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    cyan: 'text-cyan-400',
    orange: 'text-orange-400',
    pink: 'text-pink-400',
    indigo: 'text-indigo-400',
  }
  return colorMap[color] || 'text-gray-400'
}

export const getIconColor = (color: string): string => {
  return getTextColor(color)
}

export const getBgColor = (color: string, opacity = '20'): string => {
  const colorMap: Record<string, Record<string, string>> = {
    blue: { '10': 'bg-blue-500/10', '20': 'bg-blue-500/20', '30': 'bg-blue-500/30' },
    green: { '10': 'bg-green-500/10', '20': 'bg-green-500/20', '30': 'bg-green-500/30' },
    purple: { '10': 'bg-purple-500/10', '20': 'bg-purple-500/20', '30': 'bg-purple-500/30' },
    emerald: { '10': 'bg-emerald-500/10', '20': 'bg-emerald-500/20', '30': 'bg-emerald-500/30' },
    red: { '10': 'bg-red-500/10', '20': 'bg-red-500/20', '30': 'bg-red-500/30' },
    yellow: { '10': 'bg-yellow-500/10', '20': 'bg-yellow-500/20', '30': 'bg-yellow-500/30' },
    cyan: { '10': 'bg-cyan-500/10', '20': 'bg-cyan-500/20', '30': 'bg-cyan-500/30' },
    orange: { '10': 'bg-orange-500/10', '20': 'bg-orange-500/20', '30': 'bg-orange-500/30' },
  }
  return colorMap[color]?.[opacity] || 'bg-gray-500/20'
}

export const getBorderColor = (color: string, opacity = '30'): string => {
  const colorMap: Record<string, Record<string, string>> = {
    blue: { '30': 'border-blue-500/30', '50': 'border-blue-500/50' },
    green: { '30': 'border-green-500/30', '50': 'border-green-500/50' },
    purple: { '30': 'border-purple-500/30', '50': 'border-purple-500/50' },
    red: { '30': 'border-red-500/30', '50': 'border-red-500/50' },
    yellow: { '30': 'border-yellow-500/30', '50': 'border-yellow-500/50' },
    orange: { '30': 'border-orange-500/30', '50': 'border-orange-500/50' },
  }
  return colorMap[color]?.[opacity] || 'border-gray-500/30'
}
