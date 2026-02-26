import { motion } from 'framer-motion'

const linkVariants = {
  initial: { x: 0 },
  hover: { x: 4, transition: { duration: 0.2 } }
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-black mt-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight leading-none">
                  <span className="text-white">SOL</span>
                  <span className="text-purple-500">-IZER</span>
                </span>
                <span className="text-[10px] text-gray-600 tracking-wider">PAYMENT ENGINE</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Autonomous multi-agent orchestration for next-generation payment infrastructure on Solana.
            </p>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Product</h4>
            <ul className="space-y-3">
              {['Dashboard', 'Agents', 'Security', 'Pricing'].map((item) => (
                <li key={item}>
                  <motion.a 
                    href="#" 
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center gap-2"
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                  >
                    <span>→</span>
                    <span>{item}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Examples', 'Support'].map((item) => (
                <li key={item}>
                  <motion.a 
                    href="#" 
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center gap-2"
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                  >
                    <span>→</span>
                    <span>{item}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <motion.a 
                    href="#" 
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center gap-2"
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                  >
                    <span>→</span>
                    <span>{item}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div 
          className="pt-10 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            © {currentYear} SOL-IZER. Built by <motion.span 
              className="text-purple-400 font-medium"
              whileHover={{ color: '#a855f7' }}
            >
              aura10x
            </motion.span>
          </div>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Security'].map((item) => (
              <motion.a 
                key={item}
                href="#" 
                className="hover:text-purple-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
