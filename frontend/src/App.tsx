import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from './components/Navigation'
import HeroSick from './components/HeroSick'
import DashboardPro from './components/DashboardPro'
import AnimatedCards from './components/AnimatedCards'
import SystemHealth from './components/SystemHealth'
import YieldOptimizer from './components/YieldOptimizer'
import RouteOptimizer from './components/RouteOptimizer'
import FraudDetection from './components/FraudDetection'
import PricingAnalytics from './components/PricingAnalytics'
import AgentSwarm from './components/AgentSwarm'
import Footer from './components/Footer'

const SectionDivider = () => (
  <div className="max-w-7xl mx-auto px-6 py-16">
    <motion.div 
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent origin-left"
    />
  </div>
)

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="relative">
        <div className="relative z-10">
          <HeroSick />
          
          <SectionDivider />
          <DashboardPro />
          
          <SectionDivider />
          <AnimatedCards />
          
          <SectionDivider />
          <SystemHealth />
          
          <SectionDivider />
          <YieldOptimizer />
          
          <SectionDivider />
          <RouteOptimizer />
          
          <SectionDivider />
          <FraudDetection />
          
          <SectionDivider />
          <PricingAnalytics />
          
          <SectionDivider />
          <AgentSwarm />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
