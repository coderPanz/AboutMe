import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, RefreshCw, Calendar, Clock, TrendingUp, Globe } from 'lucide-react'

interface NewsArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

interface Category {
  name: string
  articles: NewsArticle[]
}

interface DailyReport {
  date: string
  generatedAt: string
  overview: string
  categories: Category[]
  highlights: string[]
  totalArticles: number
}

const categoryNames: Record<string, string> = {
  technology: '科技',
  business: '商业',
  science: '科学',
  health: '健康',
  sports: '体育',
  entertainment: '娱乐'
}

export default function DailyReport() {
  const [report, setReport] = useState<DailyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('technology')

  const fetchReport = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/daily-report')
      if (!res.ok) {
        throw new Error('Failed to fetch report')
      }
      const data = await res.json()
      setReport(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-[#0c0c0c] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-[#525252]">loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#0c0c0c] min-h-screen flex items-center justify-center">
        <div className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a] max-w-md">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#222222]">
            <div className="terminal-dot terminal-dot--red" />
            <div className="terminal-dot terminal-dot--yellow" />
            <div className="terminal-dot terminal-dot--green" />
            <span className="ml-4 font-mono text-sm text-[#737373]">error</span>
          </div>
          <div className="p-8 bg-[#0c0c0c] text-center">
            <p className="text-[#ff5f56] font-mono mb-4">error: {error}</p>
            <button
              onClick={fetchReport}
              className="btn-primary text-sm font-mono"
            >
              retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!report) return null

  const currentCategory = report.categories.find(c => c.name === activeCategory)

  return (
    <div className="bg-[#0c0c0c] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header - Terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a] mb-8">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#222222]">
              <div className="terminal-dot terminal-dot--red" />
              <div className="terminal-dot terminal-dot--yellow" />
              <div className="terminal-dot terminal-dot--green" />
              <span className="ml-4 font-mono text-sm text-[#737373]">curl -X GET /api/daily-report</span>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="editorial-display text-5xl md:text-6xl text-white mb-4">
                每日热点
              </h1>
              <div className="flex items-center gap-4 text-[#737373] font-mono text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(report.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {formatTime(report.generatedAt)}
                </span>
              </div>
            </div>
            <button
              onClick={fetchReport}
              className="p-2 bg-[#1a1a1a] text-[#737373] hover:text-[#22c55e] border border-[#222222] hover:border-[#22c55e] transition-colors"
              title="刷新"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </motion.div>

        {/* Overview - Terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a] mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-[#222222]">
            <TrendingUp size={14} className="text-[#525252]" />
            <span className="font-mono text-xs text-[#737373]">overview</span>
          </div>
          <div className="p-6 bg-[#0c0c0c]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#22c55e]/10 rounded">
                <TrendingUp size={20} className="text-[#22c55e]" />
              </div>
              <div>
                <p className="text-white leading-relaxed">{report.overview}</p>
                <p className="text-[#525252] text-sm mt-2 font-mono">
                  <span className="text-[#22c55e]">$</span> total articles: {report.totalArticles}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs - Terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {report.categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 rounded text-sm font-mono transition-colors ${
                  activeCategory === category.name
                    ? 'bg-[#22c55e] text-[#0c0c0c]'
                    : 'bg-[#1a1a1a] text-[#737373] hover:text-white border border-[#222222]'
                }`}
              >
                {categoryNames[category.name] || category.name}
                <span className="ml-1.5 opacity-60">({category.articles.length})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Articles List - Terminal style */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-px bg-[#1a1a1a] border border-[#1a1a1a]"
        >
          {currentCategory?.articles.map((article, index) => (
            <motion.a
              key={`${article.url}-${index}`}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="block bg-[#0c0c0c] hover:bg-[#111111] p-5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={12} className="text-[#525252]" />
                    <span className="text-[#22c55e] text-xs font-mono">
                      {article.source.name}
                    </span>
                    <span className="text-[#525252] text-xs">•</span>
                    <span className="text-[#525252] text-xs font-mono">
                      {new Date(article.publishedAt).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-[#22c55e] transition-colors">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-[#737373] text-sm line-clamp-2">
                      {article.description}
                    </p>
                  )}
                </div>
                <ExternalLink
                  size={14}
                  className="text-[#525252] group-hover:text-[#22c55e] transition-colors flex-shrink-0 mt-1"
                />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Empty State */}
        {currentCategory?.articles.length === 0 && (
          <div className="text-center py-12 border border-[#1a1a1a] bg-[#0c0c0c]">
            <p className="font-mono text-[#525252]">no news available</p>
          </div>
        )}
      </div>
    </div>
  )
}