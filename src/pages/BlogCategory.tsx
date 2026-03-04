import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Clock, ChevronRight, ArrowLeft } from 'lucide-react'
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
    <div className="bg-[#030305] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} className="mr-2" />
            返回博客
          </Link>
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">
            {decodedCategory}
          </h1>
          <p className="text-lg text-zinc-400">
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
                className="group block p-6 rounded-xl border border-white/[0.06] bg-[#0a0a0c] hover:bg-[#111113] hover:border-white/[0.1] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
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
                    <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[#5b8ff5] transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
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
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={20}
                    className="text-zinc-600 group-hover:text-[#5b8ff5] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                  />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500">该分类下暂无文章</p>
          </div>
        )}
      </div>
    </div>
  )
}