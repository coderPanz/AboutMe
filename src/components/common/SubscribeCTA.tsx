import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle, Twitter, Github, Rss } from 'lucide-react'

/**
 * 订阅博客 CTA 组件
 * 建立长期连接，引导用户关注社交媒体
 */
export default function SubscribeCTA() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubmitted(true)
    setEmail('')
  }

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', url: '#', color: '#3B82F6' },
    { icon: Github, label: 'GitHub', url: '#', color: '#1F2937' },
    { icon: Rss, label: 'RSS', url: '#', color: '#FBBF24' },
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10B981] to-[#059669] p-8 md:p-12"
        >
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <Mail size={32} className="text-white" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                订阅博客更新
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto">
                获取最新技术文章、项目实战和AI前沿资讯，与500+开发者一起成长
              </p>
            </div>

            {/* 订阅表单 */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="输入你的邮箱地址"
                    className="flex-1 px-5 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    required
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-4 bg-white text-[#10B981] font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-white/20 transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>订阅</span>
                        <Send size={18} />
                      </>
                    )}
                  </motion.button>
                </div>
                <p className="text-white/50 text-sm mt-3 text-center">
                  无垃圾邮件，随时可取消订阅
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto mb-8 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-white">
                  <CheckCircle size={24} />
                  <span className="text-lg font-medium">订阅成功！感谢你的关注</span>
                </div>
              </motion.div>
            )}

            {/* 社交媒体链接 */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/60 text-sm">或者关注：</span>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    title={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
