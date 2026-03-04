import type { VercelRequest, VercelResponse } from '@vercel/node'

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

interface DailyReport {
  date: string
  generatedAt: string
  overview: string
  categories: {
    name: string
    articles: NewsArticle[]
  }[]
  highlights: string[]
  totalArticles: number
}

// 获取今天的日期字符串
function getTodayDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 内存缓存
let reportCache: {
  report: DailyReport | null
  date: string
} = {
  report: null,
  date: ''
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // 只允许 GET 请求
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const today = getTodayDate()

  // 检查缓存
  if (reportCache.report && reportCache.date === today) {
    return response.status(200).json(reportCache.report)
  }

  // 获取 API Key
  const apiKey = process.env.NEWS_API_KEY

  // 获取多个类别的新闻
  const categories = ['technology', 'business', 'science', 'health', 'sports', 'entertainment']
  const categoryNews: Record<string, NewsArticle[]> = {}

  try {
    if (apiKey) {
      // 从 NewsAPI 获取各类别新闻
      for (const category of categories) {
        try {
          const res = await fetch(
            `https://newsapi.org/v2/top-headlines?country=cn&category=${category}&pageSize=10`,
            {
              headers: {
                'X-Api-Key': apiKey
              }
            }
          )
          if (res.ok) {
            const data = await res.json()
            categoryNews[category] = data.articles || []
          }
        } catch (e) {
          console.error(`Error fetching ${category}:`, e)
          categoryNews[category] = []
        }
      }
    } else {
      // 使用模拟数据
      const mockNews = (category: string): NewsArticle[] => [
        {
          source: { id: 'techcrunch', name: 'TechCrunch' },
          author: 'TechCrunch Staff',
          title: `${category === 'technology' ? 'AI' : category === 'business' ? '全球股市' : category === 'science' ? '科学突破' : category === 'health' ? '健康新知' : category === 'sports' ? '体育赛事' : '娱乐新闻'} - 今日热点新闻第一篇`,
          description: `${category} 领域的重要新闻报道，详细内容请点击查看...`,
          url: 'https://example.com/news',
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          content: '新闻详细内容...'
        },
        {
          source: { id: 'reuters', name: 'Reuters' },
          author: 'Reuters',
          title: `${category === 'technology' ? '科技创新' : category === 'business' ? '商业动态' : category === 'science' ? '研究进展' : category === 'health' ? '医疗健康' : category === 'sports' ? '赛事报道' : '娱乐资讯'} - 今日热点新闻第二篇`,
          description: `${category} 领域的重要新闻报道，详细内容请点击查看...`,
          url: 'https://example.com/news2',
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          content: '新闻详细内容...'
        },
        {
          source: { id: 'bbc', name: 'BBC News' },
          author: 'BBC News',
          title: `${category === 'technology' ? '技术前沿' : category === 'business' ? '经济观察' : category === 'science' ? '科学发现' : category === 'health' ? '健康科普' : category === 'sports' ? '体育要闻' : '娱乐焦点'} - 今日热点新闻第三篇`,
          description: `${category} 领域的重要新闻报道，详细内容请点击查看...`,
          url: 'https://example.com/news3',
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          content: '新闻详细内容...'
        }
      ]

      for (const category of categories) {
        categoryNews[category] = mockNews(category)
      }
    }

    // 计算各类别的文章总数
    let totalArticles = 0
    for (const category of categories) {
      totalArticles += categoryNews[category]?.length || 0
    }

    // 生成亮点新闻
    const highlights: string[] = []
    for (const category of categories) {
      const articles = categoryNews[category] || []
      if (articles.length > 0 && highlights.length < 5) {
        highlights.push(articles[0].title)
      }
    }

    // 生成概述
    const overview = `今日共收录 ${totalArticles} 篇热点新闻，涵盖科技、商业、科学、健康、体育、娱乐等领域。`

    // 构建日报
    const report: DailyReport = {
      date: today,
      generatedAt: new Date().toISOString(),
      overview,
      categories: categories.map(category => ({
        name: category,
        articles: categoryNews[category] || []
      })),
      highlights,
      totalArticles
    }

    // 缓存日报
    reportCache.report = report
    reportCache.date = today

    return response.status(200).json(report)
  } catch (error) {
    console.error('Daily report error:', error)
    return response.status(500).json({
      error: 'Failed to generate daily report',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}