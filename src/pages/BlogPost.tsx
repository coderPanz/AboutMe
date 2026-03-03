import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { getBlogPost } from '../data/blog'
import { MarkdownRenderer } from '../components/common/MarkdownRenderer'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getBlogPost(slug) : null

  if (!post) {
    return (
      <div className="bg-[#030305] min-h-screen">
        <div className="py-16">
          <div className="max-w-2xl mx-auto px-6">
            <h1 className="text-2xl font-semibold text-white mb-4">文章未找到</h1>
            <Link to="/blog" className="text-[#5b8ff5] hover:text-[#7c6af5] transition-colors">
              返回博客列表
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#030305] min-h-screen">
      <article className="py-16">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center text-sm text-zinc-500 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              返回
            </Link>

            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {post.readTime} 分钟阅读
                </span>
              </div>

              <h1 className="text-3xl font-semibold text-white mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs text-[#5b8ff5] bg-[#5b8ff5]/10 rounded-md font-medium border border-[#5b8ff5]/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Content */}
            <MarkdownRenderer content={post.content} />
          </motion.div>
        </div>
      </article>
    </div>
  )
}