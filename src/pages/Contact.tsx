import { motion } from 'framer-motion'
import { Github, Mail, ExternalLink } from 'lucide-react'

const socialLinks = [
  {
    key: 'github',
    icon: Github,
    label: 'GitHub',
    url: 'https://github.com/coderPanz',
    color: 'from-[#24292e] to-[#2f363d]',
    iconColor: 'text-white',
  },
  {
    key: 'email',
    icon: Mail,
    label: '邮箱',
    url: 'mailto:3108498426@qq.com',
    value: '3108498426@qq.com',
    color: 'from-[#EA4335] to-[#FBBC04]',
    iconColor: 'text-white',
  },
]

export default function Contact() {
  return (
    <div className="bg-[#030305] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">
            联系我
          </h1>
          <p className="text-lg text-zinc-400">
            如果你有任何问题或合作意向，欢迎通过以下方式联系我
          </p>
        </motion.div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
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
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative p-6 rounded-2xl card-glow overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center group-hover:shadow-lg transition-shadow`}>
                    <Icon className={social.iconColor} size={22} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
                      {social.label}
                    </h3>
                    <p className="text-zinc-500 text-sm truncate">
                      {social.value || social.label}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ExternalLink
                    size={18}
                    className="text-zinc-600 group-hover:text-white transition-colors flex-shrink-0"
                  />
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative rounded-2xl p-8 overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5b8ff5]/[0.08] to-[#3b82f6]/[0.08]" />
          <div className="absolute inset-0 border border-[#5b8ff5]/[0.2] rounded-2xl" />

          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-white mb-3">
              期待与您合作
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              无论是项目合作、技术探讨、人生规划、还是其他任何问题，我们都可以一起聊聊。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}