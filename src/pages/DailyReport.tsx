import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, RefreshCw, Calendar, Clock, TrendingUp } from 'lucide-react'

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
      <div className="bg-[#030305] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#5b8ff5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#030305] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchReport}
            className="px-6 py-2 bg-[#5b8ff5] text-white rounded-lg hover:bg-[#5b8ff5]/90 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  if (!report) return null

  const currentCategory = report.categories.find(c => c.name === activeCategory)

  return (
    <div className="bg-[#030305] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-2">
                每日热点
              </h1>
              <div className="flex items-center gap-4 text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  {formatDate(report.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {formatTime(report.generatedAt)}
                </span>
              </div>
            </div>
            <button
              onClick={fetchReport}
              className="p-2 bg-white/[0.04] text-zinc-400 hover:text-white rounded-lg border border-white/[0.06] hover:border-[#5b8ff5]/30 transition-colors"
              title="刷新"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card-glow rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#5b8ff5]/10 rounded-xl">
              <TrendingUp size={24} className="text-[#5b8ff5]" />
            </div>
            <div>
              <p className="text-white leading-relaxed">{report.overview}</p>
              <p className="text-zinc-500 text-sm mt-2">
                共收录 {report.totalArticles} 篇热点新闻
              </p>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.name
                    ? 'bg-[#5b8ff5] text-white'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06] hover:border-[#5b8ff5]/30'
                }`}
              >
                {categoryNames[category.name] || category.name}
                <span className="ml-1.5 opacity-60">({category.articles.length})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Articles List */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
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
              className="block card-glow rounded-xl p-5 hover:border-[#5b8ff5]/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#5b8ff5] text-xs font-medium">
                      {article.source.name}
                    </span>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="text-zinc-500 text-xs">
                      {new Date(article.publishedAt).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-[#5b8ff5] transition-colors">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-zinc-400 text-sm line-clamp-2">
                      {article.description}
                    </p>
                  )}
                </div>
                <ExternalLink
                  size={16}
                  className="text-zinc-500 group-hover:text-[#5b8ff5] transition-colors flex-shrink-0 mt-1"
                />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Empty State */}
        {currentCategory?.articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">暂无新闻</p>
          </div>
        )}
      </div>
    </div>
  )
}