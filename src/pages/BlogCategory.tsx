import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Clock, ChevronRight, FolderOpen } from 'lucide-react'
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
    <div className="bg-[#0c0c0c] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header - Terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a] mb-8">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#222222]">
              <div className="terminal-dot terminal-dot--red" />
              <div className="terminal-dot terminal-dot--yellow" />
              <div className="terminal-dot terminal-dot--green" />
              <span className="ml-4 font-mono text-sm text-[#737373]">
                ls ./blog/{decodedCategory.toLowerCase()}
              </span>
            </div>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center text-[#525252] hover:text-[#22c55e] mb-6 transition-colors font-mono text-sm"
          >
            <span className="mr-2">←</span>
            cd ..
          </Link>

          <h1 className="editorial-display text-5xl md:text-6xl text-white mb-4">
            {decodedCategory}
          </h1>
          <p className="font-mono text-sm text-[#737373]">
            <span className="text-[#22c55e]">$</span> wc -l ./*.{' '}
            <span className="text-[#525252]">// {posts.length} posts</span>
          </p>
        </motion.div>

        {/* Blog List - Terminal style */}
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
                className="group block p-6 bg-[#1a1a1a] border border-[#222222] hover:border-[#22c55e] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-[#525252] mb-3 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {post.readTime} min
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[#22c55e] transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-[#737373] text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs text-[#22c55e] bg-[#22c55e]/10 font-mono border border-[#22c55e]/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={20}
                    className="text-[#525252] group-hover:text-[#22c55e] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                  />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-20 border border-[#1a1a1a] bg-[#0c0c0c]">
            <FolderOpen size={48} className="mx-auto text-[#525252] mb-4" />
            <p className="font-mono text-[#525252]">
              <span className="text-[#ff5f56]">error</span>: no posts found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  )
}