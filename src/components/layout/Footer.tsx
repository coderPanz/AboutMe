import { motion } from 'framer-motion'
import { Github, Mail } from 'lucide-react'
import profile from '@/data/profile.json'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-[#1a1a1a] bg-[#0c0c0c]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Terminal prompt style */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-sm"
          >
            <span className="text-[#737373]">
              <span className="text-[#22c55e]">{profile.name}@portfolio</span>
              <span className="mx-2">:</span>
              <span className="text-[#22d3ee]">~</span>
              <span className="mx-2 text-[#737373]">exit</span>
            </span>
          </motion.div>

          {/* Social Links - Terminal style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 font-mono text-sm"
          >
            {profile.social.github && (
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-[#737373] hover:text-[#22c55e] transition-colors border border-[#1a1a1a] hover:border-[#22c55e]"
                aria-label="GitHub"
              >
                <Github size={16} />
                <span>github</span>
              </a>
            )}
            {profile.social.email && (
              <a
                href={`mailto:${profile.social.email}`}
                className="flex items-center gap-2 px-3 py-2 text-[#737373] hover:text-[#22c55e] transition-colors border border-[#1a1a1a] hover:border-[#22c55e]"
                aria-label="Email"
              >
                <Mail size={16} />
                <span>email</span>
              </a>
            )}
          </motion.div>

          {/* Divider - Terminal style */}
          <div className="w-full max-w-md">
            <div className="font-mono text-xs text-[#525252] flex items-center gap-2">
              <span>─</span>
              <span className="text-[#fbbf24]">○</span>
              <span>─</span>
            </div>
          </div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs text-[#525252]"
          >
            <span className="text-[#22c55e]">©</span> {currentYear} {profile.name} — MIT License
          </motion.p>
        </div>
      </div>
    </footer>
  )
}