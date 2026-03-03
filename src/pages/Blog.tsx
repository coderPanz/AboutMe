import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ChevronRight, FileText, Cpu, Code2, FileCode, Layers, Bot } from 'lucide-react'
import { blogPosts } from '../data/blog'

// 分类数据
const categories = [
  { name: 'AI-SKILLS', icon: Bot, color: '#9333ea' },
  { name: 'JavaScript', icon: FileText, color: '#f7df1e' },
  { name: 'TypeScript', icon: FileCode, color: '#3178c6' },
  { name: 'React', icon: Layers, color: '#61dafb' },
  { name: 'Vue', icon: Code2, color: '#4fc08d' },
  { name: 'AI-MCP', icon: Cpu, color: '#f97316' },
]

export default function Blog() {
  const recentPosts = blogPosts.slice(0, 2)

  return (
    <div className="bg-[#030305] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">
            博客
          </h1>
        </motion.div>

        {/* Blog Cards - Single column */}
        <div className="grid grid-cols-1 gap-6 mb-16">
          <h3 className="text-xl font-semibold text-white">最近文章</h3>
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block p-8 rounded-2xl border border-white/[0.06] bg-[#0a0a0c] hover:bg-[#111113] hover:border-white/[0.1] transition-all duration-300"
              >
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {post.readTime} 分钟阅读
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-[#5b8ff5] transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Arrow */}
                <div className="flex items-center text-[#5b8ff5] font-medium">
                  <span className="text-sm">阅读全文</span>
                  <ChevronRight
                    size={16}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Category Cards - Three columns with glowing dividers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">文章分类</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                className="relative"
              >
                {/* Glowing divider line - between cards in same row */}
                {index % 3 !== 0 && (
                  <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px -ml-3">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5b8ff5]/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7c6af5]/20 to-transparent blur-[1px]" />
                  </div>
                )}

                <Link
                  to={`/blog/category/${encodeURIComponent(category.name)}`}
                  className="group flex flex-col items-center justify-center p-8 rounded-2xl border border-white/[0.06] bg-[#0a0a0c] hover:bg-[#111113] hover:border-white/[0.1] transition-all duration-300 h-full"
                >
                  <category.icon
                    size={40}
                    className="mb-4 group-hover:scale-110 transition-transform"
                    style={{ color: category.color }}
                  />
                  <span className="text-base font-medium text-white group-hover:text-[#5b8ff5] transition-colors">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty state */}
        {blogPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  )
}