import { motion } from 'framer-motion'
import { Github, Mail, Send } from 'lucide-react'

const socialLinks = [
  {
    key: 'github',
    icon: Github,
    label: 'GitHub',
    url: 'https://github.com/coderPanz',
    value: '@coderPanz',
  },
  {
    key: 'email',
    icon: Mail,
    label: '邮箱',
    url: 'mailto:3108498426@qq.com',
    value: '3108498426@qq.com',
  },
]

export default function Contact() {
  return (
    <div className="bg-[#0c0c0c] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header - Terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="editorial-display text-5xl md:text-6xl text-white mb-4">
            联系我
          </h1>
          <p className="font-mono text-sm text-[#737373]">
            <span className="text-[#22c55e]">$</span> ./contact.sh --all
          </p>
        </motion.div>

        {/* Social Links Grid - Terminal style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a] border border-[#1a1a1a] mb-16">
          {socialLinks.map((social, index) => {
            const Icon = social.icon

            return (
              <motion.a
                key={social.key}
                href={social.url}
                target={social.key !== 'email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group bg-[#0c0c0c] hover:bg-[#111111] p-6 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-[#1a1a1a] border border-[#222222] flex items-center justify-center group-hover:border-[#22c55e] transition-colors">
                    <Icon size={20} className="text-[#737373] group-hover:text-[#22c55e] transition-colors" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white">
                      {social.label}
                    </h3>
                    <p className="text-[#525252] text-sm font-mono truncate">
                      {social.value}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="font-mono text-sm text-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Message Card - Terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a]"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#222222]">
            <Send size={14} className="text-[#525252]" />
            <span className="font-mono text-xs text-[#737373]">message</span>
          </div>
          <div className="p-8 bg-[#0c0c0c]">
            <h2 className="text-xl font-semibold text-white mb-3">
              期待与您合作
            </h2>
            <p className="text-[#737373] leading-relaxed font-mono text-sm">
              // 无论是项目合作、技术探讨、人生规划、还是其他任何问题，
              <br />
              // 我们都可以一起聊聊。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}