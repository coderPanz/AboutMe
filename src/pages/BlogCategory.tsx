import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Clock, ChevronRight, ArrowLeft, FolderOpen } from 'lucide-react'
import { getBlogPostsByCategory } from '../data/blog'

// 获取文章的完整 slug 路径
function getPostSlug(post: ReturnType<typeof getBlogPostsByCategory>[0]): string {
  return (post as typeof post & { fullSlug: string }).fullSlug || post.slug
}

export default function BlogCategory() {
  const { category } = useParams<{ category: string }>()
  const decodedCategory = category ? decodeURIComponent(category) : ''
  const posts = getBlogPostsByCategory(decodedCategory)

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors"
          >
            <ArrowLeft size={18} />
            <span>返回博客</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="hero-tag mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>分类浏览</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
            <span className="title-highlight">{decodedCategory}</span>
          </h1>
          <p className="text-[#9CA3AF]">
            共 {posts.length} 篇文章
          </p>
        </motion.div>

        {/* Blog List */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                to={`/blog/${getPostSlug(post)}`}
                className="group card-modern block p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-[#9CA3AF] mb-3">
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
                    <h2 className="text-lg font-bold text-[#1F2937] mb-2 group-hover:text-[#10B981] transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-[#4B5563] text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
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

                  {/* Arrow */}
                  <ChevronRight
                    size={20}
                    className="text-[#F3F4F6] group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                  />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-modern p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-6">
              <FolderOpen size={32} className="text-[#9CA3AF]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-2">
              暂无文章
            </h3>
            <p className="text-[#9CA3AF]">
              该分类下暂时没有文章
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
