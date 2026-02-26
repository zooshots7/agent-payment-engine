import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export function TextGradient({
  children,
  className,
  from = 'from-purple-400',
  via = 'via-purple-500',
  to = 'to-purple-600',
  animated = false,
}: {
  children: ReactNode
  className?: string
  from?: string
  via?: string
  to?: string
  animated?: boolean
}) {
  const gradientClass = cn(
    'text-transparent bg-clip-text bg-gradient-to-r',
    from,
    via,
    to,
    className
  )

  if (animated) {
    return (
      <motion.span
        className={gradientClass}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      >
        {children}
      </motion.span>
    )
  }

  return <span className={gradientClass}>{children}</span>
}

export function TextShine({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.span
      className={cn(
        'inline-block relative text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-purple-400',
        className
      )}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% auto',
      }}
    >
      {children}
    </motion.span>
  )
}

export function TextReveal({
  children,
  className,
  delay = 0,
}: {
  children: string
  className?: string
  delay?: number
}) {
  const letters = children.split('')

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.05,
          }}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  )
}
