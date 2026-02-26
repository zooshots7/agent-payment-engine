import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for merging Tailwind CSS classes
 * Handles conflicts intelligently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Layout Utilities - Perfect spacing and structure
 */
export const layout = {
  // Container sizes
  container: {
    sm: "max-w-4xl mx-auto px-6",
    md: "max-w-5xl mx-auto px-6",
    lg: "max-w-7xl mx-auto px-6",
    xl: "max-w-[1400px] mx-auto px-6",
    full: "w-full mx-auto px-6",
  },
  
  // Section spacing (vertical)
  section: {
    xs: "py-12",
    sm: "py-16",
    md: "py-24",
    lg: "py-32",
    xl: "py-40",
  },
  
  // Gap spacing
  gap: {
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  },
  
  // Grid layouts
  grid: {
    cols1: "grid grid-cols-1",
    cols2: "grid grid-cols-1 md:grid-cols-2",
    cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    auto: "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]",
  },
}

/**
 * Typography Utilities
 */
export const typography = {
  // Headings
  h1: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
  h2: "text-4xl md:text-5xl font-bold tracking-tight",
  h3: "text-3xl md:text-4xl font-bold tracking-tight",
  h4: "text-2xl md:text-3xl font-bold tracking-tight",
  h5: "text-xl md:text-2xl font-semibold",
  h6: "text-lg md:text-xl font-semibold",
  
  // Body text
  body: {
    lg: "text-lg leading-relaxed",
    md: "text-base leading-relaxed",
    sm: "text-sm leading-normal",
    xs: "text-xs leading-normal",
  },
  
  // Special
  gradient: "text-transparent bg-clip-text bg-gradient-to-r",
  muted: "text-gray-400",
  lead: "text-xl md:text-2xl text-gray-400 leading-relaxed",
}

/**
 * Component Utilities
 */
export const components = {
  // Cards
  card: {
    base: "bg-gray-900/50 border border-gray-800 rounded-xl p-6",
    hover: "hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/10",
    glass: "bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6",
  },
  
  // Buttons
  button: {
    primary: "px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors",
    secondary: "px-6 py-3 bg-gray-900 hover:bg-gray-800 text-gray-200 rounded-xl font-medium transition-colors border border-gray-800",
    ghost: "px-6 py-3 hover:bg-gray-900 text-gray-200 rounded-xl font-medium transition-colors",
  },
  
  // Input fields
  input: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none transition-colors",
}

/**
 * Animation Utilities
 */
export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  
  fadeInUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 },
  },
  
  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
  
  stagger: {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    },
  },
}

/**
 * Viewport utilities for scroll animations
 */
export const viewport = {
  once: { once: true, margin: "-100px" },
  repeat: { once: false, margin: "-100px" },
  amount: { once: true, amount: 0.3 },
}
