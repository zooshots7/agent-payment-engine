import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from './components/Navigation'
import HeroSick from './components/HeroSick'
import DashboardPro from './components/DashboardPro'
import SystemHealth from './components/SystemHealth'
import AnimatedCards from './components/AnimatedCards'
import Footer from './components/Footer'

const SectionDivider = () => (
  <div className="max-w-7xl mx-auto px-6 py-24">
    <motion.div 
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="h-[1px] bg-gradient-to-r from-transparent via-gray-800/50 to-transparent origin-left"
    />
  </div>
)

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="relative">
        <div className="relative z-10">
          {/* Hero Section */}
          <HeroSick />
          
          {/* Main Dashboard */}
          <SectionDivider />
          <div className="py-16">
            <DashboardPro />
          </div>
          
          {/* Feature Cards */}
          <SectionDivider />
          <div className="py-16">
            <AnimatedCards />
          </div>
          
          {/* System Health */}
          <SectionDivider />
          <div className="py-16">
            <SystemHealth />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
