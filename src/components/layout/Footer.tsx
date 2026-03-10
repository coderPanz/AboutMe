import { motion } from 'framer-motion'
import { Github, Mail, Heart, Twitter } from 'lucide-react'
import LogoIcon from '../common/LogoIcon'
import profile from '@/data/profile.json'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { label: '首页', href: '/' },
    { label: '博客', href: '/blog' },
    { label: '项目', href: '/projects' },
    { label: '关于', href: '/about' },
    { label: '联系', href: '/contact' },
  ]

  const socialLinks = [
    { icon: Github, href: profile.social.github || '#', label: 'GitHub', color: 'hover:text-[#1F2937]' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-[#3B82F6]' },
    { icon: Mail, href: `mailto:${profile.social.email}`, label: 'Email', color: 'hover:text-[#10B981]' },
  ]

  return (
    <footer className="relative bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & 简介 */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <LogoIcon size={40} />
              <div>
                <span className="text-lg font-bold text-[#1F2937]">北漂螺丝钉</span>
                <p className="text-xs text-[#9CA3AF]">Half-stack Developer</p>
              </div>
            </motion.div>
            <p className="text-sm text-[#6B7280] max-w-sm leading-relaxed">
              一个半吊子AI+前端开发工程师的技术博客，分享学习心得、项目实战和生活感悟。
              人不一定往上走，也可以四处走走。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="font-semibold text-[#1F2937] mb-4">快速链接</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-[#6B7280] hover:text-[#10B981] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h4 className="font-semibold text-[#1F2937] mb-4">关注我</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl bg-[#F9FAFB] flex items-center justify-center text-[#9CA3AF] ${social.color} transition-colors`}
                    title={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-[#9CA3AF] flex items-center gap-1"
          >
            © {currentYear} 北漂螺丝钉 · Made with 
            <Heart size={14} className="text-[#EF4444] fill-[#EF4444] mx-1" />
            in Beijing
          </motion.p>
          <p className="text-xs text-[#9CA3AF]">
            Powered by React + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
