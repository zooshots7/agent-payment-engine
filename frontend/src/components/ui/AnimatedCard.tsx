import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export function AnimatedCard({
  children,
  className,
  containerClassName,
}: {
  children: ReactNode
  className?: string
  containerClassName?: string
}) {
  return (
    <motion.div
      className={cn('relative group', containerClassName)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Animated border gradient */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      {/* Card content */}
      <div
        className={cn(
          'relative bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl p-6 overflow-hidden',
          'group-hover:border-transparent transition-all duration-300',
          className
        )}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  )
}

export function GlowCard({
  children,
  className,
  glowColor = 'rgba(168, 85, 247, 0.4)',
}: {
  children: ReactNode
  className?: string
  glowColor?: string
}) {
  return (
    <motion.div
      className={cn('relative group', className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-1 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: glowColor }}
      />
      
      {/* Card */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-hidden">
        {children}
      </div>
    </motion.div>
  )
}

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn('relative', className)}
      whileHover={{
        rotateX: 5,
        rotateY: 5,
        scale: 1.05,
      }}
      transition={{ duration: 0.3 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {children}
      </div>
    </motion.div>
  )
}
