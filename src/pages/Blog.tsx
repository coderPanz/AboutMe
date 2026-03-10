import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  FileText, 
  Cpu, 
  Code2, 
  FileCode, 
  Layers, 
  Bot, 
  Wrench, 
  Terminal, 
  Palette, 
  Container, 
  Cloud, 
  Brain, 
  Boxes, 
  Network,
  BookOpen,
  Lightbulb,
  Zap,
  ArrowRight,
  LucideIcon 
} from 'lucide-react'
import { blogPosts } from '../data/blog'

// 分类数据 - 使用新配色循环
const categories: { name: string; icon: LucideIcon; color: string; bgColor: string }[] = [
  { name: 'Agent-SKILLS', icon: Bot, color: '#10B981', bgColor: '#ECFDF5' },
  { name: 'JavaScript', icon: FileText, color: '#FBBF24', bgColor: '#FFFBEB' },
  { name: 'TypeScript', icon: FileCode, color: '#3B82F6', bgColor: '#EFF6FF' },
  { name: 'React', icon: Layers, color: '#10B981', bgColor: '#ECFDF5' },
  { name: 'Vue', icon: Code2, color: '#3B82F6', bgColor: '#EFF6FF' },
  { name: 'Agent-MCP', icon: Cpu, color: '#FBBF24', bgColor: '#FFFBEB' },
  { name: 'Agent', icon: Brain, color: '#10B981', bgColor: '#ECFDF5' },
  { name: 'ClaudeCode', icon: Terminal, color: '#3B82F6', bgColor: '#EFF6FF' },
  { name: 'CSS', icon: Palette, color: '#FBBF24', bgColor: '#FFFBEB' },
  { name: 'Docker', icon: Container, color: '#3B82F6', bgColor: '#EFF6FF' },
  { name: 'K8s', icon: Cloud, color: '#10B981', bgColor: '#ECFDF5' },
  { name: 'LangChain', icon: Network, color: '#FBBF24', bgColor: '#FFFBEB' },
  { name: 'MCP', icon: Boxes, color: '#10B981', bgColor: '#ECFDF5' },
  { name: 'Nest', icon: Wrench, color: '#3B82F6', bgColor: '#EFF6FF' },
  { name: 'Python', icon: Code2, color: '#FBBF24', bgColor: '#FFFBEB' },
]

// 三步法数据 - 使用新配色
const steps = [
  {
    number: '01',
    title: '深度阅读',
    description: '深入理解技术原理，不满足于表面的API调用，探究底层实现机制',
    icon: BookOpen,
    variant: 'primary',
  },
  {
    number: '02',
    title: '实践总结',
    description: '将所学知识应用到实际项目中，记录踩坑过程与解决方案',
    icon: Lightbulb,
    variant: 'secondary',
  },
  {
    number: '03',
    title: '分享输出',
    description: '通过博客文章输出知识，在分享中加深理解并获得反馈',
    icon: Zap,
    variant: 'accent',
  },
]

// 获取文章的完整 slug 路径
function getPostSlug(post: typeof blogPosts[0]): string {
  return (post as typeof post & { fullSlug: string }).fullSlug || post.slug
}

export default function Blog() {
  const recentPosts = blogPosts.slice(0, 6)

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Hero Section - 头图区域 */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background decoration - 三色渐变 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#10B981]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/3 w-72 h-72 bg-[#FBBF24]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* 日记标签 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="hero-tag mb-8"
            >
              <span className="hero-tag-dot" />
              <span>技术日记</span>
            </motion.div>

            {/* 大标题 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1F2937] mb-6 leading-tight">
              <span className="title-highlight">我的博客</span>
            </h1>

            {/* 励志短句 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="motivational-quote inline-block"
            >
              <p className="text-[#4B5563] font-medium italic relative z-10 pl-4">
                保持好奇，持续学习，无限进步
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 三步法 Section - 使用新配色 */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">
              我的学习<span className="gradient-text">三步法</span>
            </h2>
            <p className="text-[#9CA3AF] max-w-2xl mx-auto">
              高效学习不是死记硬背，而是理解、实践、分享的正向循环
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`step-card p-8 ${
                  step.variant === 'secondary' ? 'step-card-secondary' : 
                  step.variant === 'accent' ? 'step-card-accent' : ''
                }`}
              >
                {/* Step Badge */}
                <div className={`step-badge mb-6 ${
                  step.variant === 'secondary' ? 'step-badge-secondary' : 
                  step.variant === 'accent' ? 'step-badge-accent' : ''
                }`}>
                  STEP {step.number}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  step.variant === 'primary' ? 'bg-[#ECFDF5] text-[#10B981]' : 
                  step.variant === 'secondary' ? 'bg-[#EFF6FF] text-[#3B82F6]' : 
                  'bg-[#FFFBEB] text-[#FBBF24]'
                }`}>
                  <step.icon size={28} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#4B5563] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 最近文章 Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-2">
                最近文章
              </h2>
              <p className="text-[#9CA3AF]">
                分享最新的技术心得与学习笔记
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 text-[#3B82F6] font-medium hover:gap-3 transition-all"
            >
              查看全部
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* 文章网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  to={`/blog/${getPostSlug(post)}`}
                  className="group card-modern block h-full"
                >
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-[#9CA3AF] mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#3B82F6]" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#3B82F6]" />
                        {post.readTime} min
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#1F2937] mb-3 group-hover:text-[#10B981] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[#4B5563] text-sm leading-relaxed mb-5 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags - 循环使用三色 */}
                    <div className="flex flex-wrap gap-2">
                      {(post.tags || []).slice(0, 3).map((tag, idx) => (
                        <span
                          key={tag}
                          className={`text-xs ${
                            idx === 0 ? 'tag-primary' : 
                            idx === 1 ? 'tag-secondary' : 
                            'tag-accent'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-[#F3F4F6] flex items-center justify-between">
                    <span className="text-sm font-medium text-[#3B82F6] flex items-center gap-1">
                      阅读更多
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Mobile View All Link */}
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#3B82F6] font-medium"
            >
              查看全部文章
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 文章分类 Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">
              文章分类
            </h2>
            <p className="text-[#9CA3AF]">
              按技术领域分类，快速找到你感兴趣的内容
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 5) * 0.05 }}
              >
                <Link
                  to={`/blog/category/${encodeURIComponent(category.name)}`}
                  className="category-card"
                >
                  <div 
                    className="category-card-icon"
                    style={{ backgroundColor: category.bgColor, color: category.color }}
                  >
                    <category.icon size={24} />
                  </div>
                  <span className="text-sm font-medium text-[#4B5563] text-center">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Empty state */}
      {blogPosts.length === 0 && (
        <div className="py-20 px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-[#9CA3AF]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-2">
              暂无文章
            </h3>
            <p className="text-[#9CA3AF]">
              文章正在撰写中，敬请期待...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
