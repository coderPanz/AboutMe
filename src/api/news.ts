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

// 内存缓存
let cache: {
  data: NewsArticle[] | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

const CACHE_DURATION = 30 * 60 * 1000 // 30 分钟缓存

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // 只允许 GET 请求
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  // 检查缓存
  const now = Date.now()
  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    return response.status(200).json({
      status: 'ok',
      articles: cache.data,
      fromCache: true
    })
  }

  // 获取 API Key
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    // 如果没有 API Key，返回模拟数据
    const mockArticles: NewsArticle[] = [
      {
        source: { id: 'techcrunch', name: 'TechCrunch' },
        author: 'TechCrunch Staff',
        title: '科技前沿：AI 技术持续改变世界',
        description: '人工智能技术正在快速发展，为各行各业带来变革。',
        url: 'https://techcrunch.com',
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        content: 'AI 技术的最新发展值得关注...'
      },
      {
        source: { id: 'reuters', name: 'Reuters' },
        author: 'Reuters',
        title: '全球财经动态',
        description: '今日全球市场重要财经新闻汇总。',
        url: 'https://reuters.com',
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        content: '全球市场今日动态...'
      },
      {
        source: { id: 'bbc', name: 'BBC News' },
        author: 'BBC News',
        title: '国际要闻：世界各地重要新闻',
        description: '今日国际重要新闻简报。',
        url: 'https://bbc.com/news',
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        content: '国际要闻简报...'
      },
      {
        source: { id: 'the-guardian', name: 'The Guardian' },
        author: 'The Guardian',
        title: '环境保护新进展',
        description: '全球环保事业取得新进展。',
        url: 'https://theguardian.com',
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        content: '环保新进展...'
      },
      {
        source: { id: 'cnn', name: 'CNN' },
        author: 'CNN',
        title: '科技创新点亮未来',
        description: '最新科技创新动态。',
        url: 'https://cnn.com',
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        content: '科技创新动态...'
      }
    ]

    cache.data = mockArticles
    cache.timestamp = now

    return response.status(200).json({
      status: 'ok',
      articles: mockArticles,
      fromCache: false
    })
  }

  try {
    // 从 NewsAPI 获取热点新闻
    const category = request.query.category as string || 'general'
    const response_1 = await fetch(
      `https://newsapi.org/v2/top-headlines?country=cn&category=${category}&pageSize=20`,
      {
        headers: {
          'X-Api-Key': apiKey
        }
      }
    )

    if (!response_1.ok) {
      throw new Error(`NewsAPI error: ${response_1.status}`)
    }

    const data = await response_1.json()

    // 缓存数据
    cache.data = data.articles || []
    cache.timestamp = now

    return response.status(200).json({
      status: 'ok',
      articles: data.articles || [],
      fromCache: false
    })
  } catch (error) {
    console.error('News API error:', error)
    return response.status(500).json({
      error: 'Failed to fetch news',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}