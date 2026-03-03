import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import profile from '@/data/profile.json'

const socialLinks = [
  { key: 'github', icon: Github, label: 'GitHub' },
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
  { key: 'twitter', icon: Twitter, label: 'Twitter' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/5">
      {/* Gradient fade effect */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-white"
          >
            About<span className="gradient-text">Me</span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-6"
          >
            {socialLinks.map((social) => {
              const Icon = social.icon
              const url = profile.social[social.key as keyof typeof profile.social]
              if (!url) return null

              return (
                <a
                  key={social.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2 text-zinc-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <Icon size={20} />
                  <span className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )
            })}
            <a
              href={`mailto:${profile.social.email}`}
              className="group relative p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
              <span className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>

          {/* Divider */}
          <div className="w-full max-w-xs divider" />

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-zinc-500"
          >
            © {currentYear} {profile.name}. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
