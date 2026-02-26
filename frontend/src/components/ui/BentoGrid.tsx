import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) => {
  return (
    <div
      className={cn(
        'grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | ReactNode
  description?: string | ReactNode
  header?: ReactNode
  icon?: ReactNode
}) => {
  return (
    <motion.div
      className={cn(
        'row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4',
        'bg-gray-900/50 border-gray-800 hover:border-purple-500/30',
        className
      )}
      whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.5)' }}
      transition={{ duration: 0.3 }}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-white mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-gray-400 text-sm">
          {description}
        </div>
      </div>
    </motion.div>
  )
}
