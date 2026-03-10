import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { getBlogPost } from '../data/blog'
import { MarkdownRenderer } from '../components/common/MarkdownRenderer'

export default function BlogPost() {
  const { '*': slug } = useParams<{ '*': string }>()
  const post = slug ? getBlogPost(slug) : null

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-modern p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-[#9CA3AF]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] mb-4">文章未找到</h1>
            <p className="text-[#4B5563] mb-6">抱歉，您访问的文章不存在或已被移除</p>
            <Link to="/blog" className="btn-primary">
              返回博客列表
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <article className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Back link - 使用蓝色点缀 */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] mb-8 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>返回博客</span>
            </Link>

            {/* Header Card */}
            <header className="mb-10">
              <div className="card-modern p-8">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-[#9CA3AF] mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#3B82F6]" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#3B82F6]" />
                    {post.readTime} min read
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Tags - 循环使用三色 */}
                <div className="flex flex-wrap gap-2">
                  {(post.tags || []).map((tag, idx) => (
                    <span
                      key={tag}
                      className={`text-xs ${
                        idx % 3 === 0 ? 'tag-primary' : 
                        idx % 3 === 1 ? 'tag-secondary' : 
                        'tag-accent'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="card-modern p-8 md:p-12">
              <MarkdownRenderer content={post.content} />
            </div>
          </motion.div>
        </div>
      </article>
    </div>
  )
}
