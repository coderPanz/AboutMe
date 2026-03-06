import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { getBlogPost } from '../data/blog'
import { MarkdownRenderer } from '../components/common/MarkdownRenderer'

export default function BlogPost() {
  const { '*': slug } = useParams<{ '*': string }>()
  const post = slug ? getBlogPost(slug) : null

  if (!post) {
    return (
      <div className="bg-[#0c0c0c] min-h-screen">
        <div className="py-16">
          <div className="max-w-2xl mx-auto px-6">
            <div className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a]">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#222222]">
                <div className="terminal-dot terminal-dot--red" />
                <div className="terminal-dot terminal-dot--yellow" />
                <div className="terminal-dot terminal-dot--green" />
                <span className="ml-4 font-mono text-sm text-[#737373]">error</span>
              </div>
              <div className="p-8 bg-[#0c0c0c]">
                <h1 className="text-2xl font-semibold text-white mb-4">文章未找到</h1>
                <Link to="/blog" className="text-[#22c55e] hover:text-[#4ade80] font-mono text-sm">
                  <span className="mr-2">$</span> cd ../blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0c0c0c] min-h-screen">
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Back link - Terminal style */}
            <Link
              to="/blog"
              className="inline-flex items-center text-sm text-[#525252] hover:text-[#22c55e] mb-8 transition-colors font-mono"
            >
              <span className="mr-2">←</span>
              cd ..
            </Link>

            {/* Header */}
            <header className="mb-10">
              <div className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a] mb-8">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#222222]">
                  <FileText size={14} className="text-[#525252]" />
                  <span className="ml-2 font-mono text-xs text-[#737373]">
                    cat ./{post.slug}.md
                  </span>
                </div>
                <div className="p-6 bg-[#0c0c0c]">
                  <div className="flex items-center gap-4 text-xs text-[#525252] mb-4 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {post.readTime} min read
                    </span>
                  </div>

                  <h1 className="text-3xl font-semibold text-white mb-4">
                    {post.title}
                  </h1>

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