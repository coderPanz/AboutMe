import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  hoverGlow?: boolean
}

export default function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(99, 102, 241, 0.15)',
  hoverGlow = true,
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={hoverGlow ? { y: -4 } : undefined}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #18181b 0%, #1f1f23 100%)',
      }}
    >
      {/* Border gradient */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          padding: '1px',
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Glow effect on hover */}
      {hoverGlow && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}`,
          }}
          whileHover={{ opacity: 1 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}