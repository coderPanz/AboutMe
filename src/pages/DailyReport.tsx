import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, RefreshCw, Calendar, Clock, TrendingUp, Globe, AlertCircle } from 'lucide-react'

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

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  technology: { bg: '#ECFDF5', text: '#10B981', border: '#10B981' },
  business: { bg: '#FFFBEB', text: '#FBBF24', border: '#FBBF24' },
  science: { bg: '#EFF6FF', text: '#3B82F6', border: '#3B82F6' },
  health: { bg: '#ECFDF5', text: '#10B981', border: '#10B981' },
  sports: { bg: '#F9FAFB', text: '#9CA3AF', border: '#9CA3AF' },
  entertainment: { bg: '#FFFBEB', text: '#FBBF24', border: '#FBBF24' },
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
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9CA3AF]">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] py-12 px-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-modern p-12 text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFFBEB] flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-[#FBBF24]" />
          </div>
          <h3 className="text-xl font-bold text-[#1F2937] mb-2">加载失败</h3>
          <p className="text-[#4B5563] mb-6">{error}</p>
          <button
            onClick={fetchReport}
            className="btn-primary"
          >
            重试
          </button>
        </motion.div>
      </div>
    )
  }

  if (!report) return null

  const currentCategory = report.categories.find(c => c.name === activeCategory)

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="hero-tag mb-4">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>每日热点</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
                今日资讯
              </h1>
              <div className="flex items-center gap-4 text-[#9CA3AF] text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#3B82F6]" />
                  {formatDate(report.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#3B82F6]" />
                  {formatTime(report.generatedAt)}
                </span>
              </div>
            </div>
            <button
              onClick={fetchReport}
              className="p-3 bg-white text-[#9CA3AF] hover:text-[#10B981] border border-[#F3F4F6] rounded-xl hover:border-[#10B981] transition-all"
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
          className="card-modern p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#ECFDF5] rounded-xl">
              <TrendingUp size={24} className="text-[#10B981]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">今日概览</h2>
              <p className="text-[#4B5563] leading-relaxed">{report.overview}</p>
              <p className="text-sm text-[#9CA3AF] mt-3">
                共 {report.totalArticles} 篇文章
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
            {report.categories.map((category) => {
              const colors = categoryColors[category.name] || categoryColors.technology
              const isActive = activeCategory === category.name
              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'bg-white text-[#4B5563] hover:text-[#1F2937] border border-[#F3F4F6] hover:border-[#E5E7EB]'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: colors.border }
                      : {}
                  }
                >
                  {categoryNames[category.name] || category.name}
                  <span className="ml-1.5 opacity-60">({category.articles.length})</span>
                </button>
              )
            })}
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
              className="group card-modern block p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={12} className="text-[#9CA3AF]" />
                    <span className="text-[#10B981] text-xs font-medium">
                      {article.source.name}
                    </span>
                    <span className="text-[#F3F4F6] text-xs">•</span>
                    <span className="text-[#9CA3AF] text-xs">
                      {new Date(article.publishedAt).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <h3 className="text-[#1F2937] font-semibold mb-2 line-clamp-2 group-hover:text-[#10B981] transition-colors">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-[#4B5563] text-sm line-clamp-2">
                      {article.description}
                    </p>
                  )}
                </div>
                <ExternalLink
                  size={16}
                  className="text-[#F3F4F6] group-hover:text-[#3B82F6] transition-colors flex-shrink-0 mt-1"
                />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Empty State */}
        {currentCategory?.articles.length === 0 && (
          <div className="card-modern p-12 text-center">
            <p className="text-[#9CA3AF]">暂无新闻</p>
          </div>
        )}
      </div>
    </div>
  )
}
