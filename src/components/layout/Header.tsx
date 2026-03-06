import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/about', label: '关于' },
  { path: '/projects', label: '项目' },
  { path: '/blog', label: '博客' },
  { path: '/daily', label: '每日热点' },
  { path: '/contact', label: '联系' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0c0c0c]/95 border-b border-[#1a1a1a]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo - Terminal style */}
        <NavLink
          to="/"
          className="group font-mono"
        >
          <span className="text-base text-white">
            <span className="text-[#22c55e]">北漂螺丝钉</span>
          </span>
        </NavLink>

        {/* Desktop Nav - Terminal style */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-mono transition-colors ${
                  isActive
                    ? 'text-[#22c55e]'
                    : 'text-[#737373] hover:text-[#a3a3a3]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="text-[#525252] mr-1">{isActive ? '*' : '·'}</span>
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* CTA Button - Desktop - Terminal style */}
        <div className="hidden md:block">
          <a
            href="mailto:contact@example.com"
            className="btn-primary text-sm font-mono"
          >
            <span className="text-[#0c0c0c] mr-2">$</span>
            hire-me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[#737373] hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0c0c0c]/95 border-t border-[#1a1a1a]"
          >
            <div className="px-6 py-4 font-mono space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-sm transition-all ${
                        isActive
                          ? 'text-[#22c55e]'
                          : 'text-[#737373] hover:text-white'
                      }`
                    }
                  >
                    <span className="text-[#525252] mr-2">{index + 1}.</span>
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-2"
              >
                <a
                  href="mailto:contact@example.com"
                  className="block w-full btn-primary text-center text-sm py-3 font-mono"
                >
                  <span className="text-[#0c0c0c] mr-2">$</span>
                  hire-me
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}