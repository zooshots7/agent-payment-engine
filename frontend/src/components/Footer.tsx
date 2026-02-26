import { motion } from 'framer-motion'
import { Github, Twitter, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] mt-32">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-white">SOL-IZER</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Next-generation payment infrastructure powered by autonomous AI agents on Solana.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              {['Documentation', 'API Reference', 'GitHub', 'Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-white">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: MessageCircle, href: '#' }
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div 
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            © {currentYear} SOL-IZER. Built by <span className="text-violet-400 font-medium">aura10x</span>
          </div>
          <div className="flex gap-6">
            {['Privacy', 'Terms'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
