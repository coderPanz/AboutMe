import { motion } from 'framer-motion'
import { Github, Mail, Send } from 'lucide-react'

const socialLinks = [
  {
    key: 'github',
    icon: Github,
    label: 'GitHub',
    url: 'https://github.com/coderPanz',
    value: '@coderPanz',
    color: '#1F2937',
    bgColor: '#F9FAFB',
  },
  {
    key: 'email',
    icon: Mail,
    label: '邮箱',
    url: 'mailto:3108498426@qq.com',
    value: '3108498426@qq.com',
    color: '#10B981',
    bgColor: '#ECFDF5',
  },
]

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="hero-tag mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>联系方式</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
            联系我
          </h1>
          <p className="text-[#9CA3AF]">
            有任何问题或合作意向，欢迎随时联系
          </p>
        </motion.div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
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
                className="group card-modern p-6"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: social.bgColor }}
                  >
                    <Icon size={24} style={{ color: social.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#1F2937] mb-1">
                      {social.label}
                    </h3>
                    <p className="text-[#9CA3AF] text-sm truncate">
                      {social.value}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="text-lg text-[#F3F4F6] group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all">
                    →
                  </span>
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
          className="card-modern p-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] flex items-center justify-center mx-auto mb-6">
            <Send size={28} className="text-[#10B981]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
            期待与您合作
          </h2>
          <p className="text-[#4B5563] leading-relaxed max-w-lg mx-auto">
            无论是项目合作、技术探讨、人生规划，还是其他任何问题，
            我们都可以一起聊聊。
          </p>
        </motion.div>
      </div>
    </div>
  )
}
