import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import { kv } from '@vercel/kv'

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

const KV_KEY_PREFIX = 'daily-report:'

interface NewsArticle {
  source: { id: string | null; name: string }
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

interface DailyReportData {
  date: string
  generatedAt: string
  overview: string
  categories: Category[]
  highlights: string[]
  totalArticles: number
}

// In-memory cache (same instance only); primary cache is Vercel KV
let memoryCache: { date: string; report: DailyReportData } | null = null

function getTodayCN(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' })
}

async function generateReport(): Promise<DailyReportData> {
  const now = new Date()
  const dateLabel = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  })
  const dateISO = getTodayCN()

  const prompt = `今天是${dateLabel}。请使用联网搜索功能，搜索今天最新的热点新闻。

请严格按照以下JSON格式返回结果，只返回纯JSON，不要有任何markdown代码块标记、解释或其他文字：

{
  "date": "${dateISO}",
  "generatedAt": "${now.toISOString()}",
  "overview": "今日新闻总体概述，2-3句话，概括今天最重要的事件",
  "categories": [
    {
      "name": "technology",
      "articles": [
        {
          "source": { "id": null, "name": "媒体名称" },
          "author": null,
          "title": "新闻标题",
          "description": "新闻摘要，1-2句话",
          "url": "新闻原文链接",
          "urlToImage": null,
          "publishedAt": "ISO格式时间",
          "content": null
        }
      ]
    },
    { "name": "business", "articles": [] },
    { "name": "science", "articles": [] },
    { "name": "health", "articles": [] },
    { "name": "sports", "articles": [] },
    { "name": "entertainment", "articles": [] }
  ],
  "highlights": ["今日亮点1", "今日亮点2", "今日亮点3"],
  "totalArticles": 30
}

要求：
- categories 必须包含且仅包含：technology、business、science、health、sports、entertainment
- 每个分类提供 4-5 篇今日真实热点新闻
- title、description、overview、highlights 全部用中文
- url 填写真实的新闻链接
- totalArticles 为所有文章总数
- 只返回JSON，不要有任何其他内容`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const create = openai.chat.completions.create.bind(openai.chat.completions) as any
  const completion = await create({
    model: 'qwen3.5-flash',
    messages: [
      {
        role: 'system',
        content:
          '你是一个新闻聚合助手，使用联网搜索获取最新新闻并整理成结构化JSON数据。只返回纯JSON，不要有任何额外说明或markdown格式。',
      },
      { role: 'user', content: prompt },
    ],
    enable_search: true,
    enable_thinking: false,
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error('Empty response from DashScope API')

  // Strip markdown code fences if model adds them
  const cleaned = raw
    .replace(/^```(?:json)?\s*\n?/i, '')
    .replace(/\n?```\s*$/i, '')
    .trim()

  let parsed: DailyReportData
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Could not extract JSON from API response')
    parsed = JSON.parse(match[0])
  }

  // Ensure all 6 categories are present
  const requiredCategories = ['technology', 'business', 'science', 'health', 'sports', 'entertainment']
  const existingNames = new Set(parsed.categories.map((c) => c.name))
  for (const name of requiredCategories) {
    if (!existingNames.has(name)) {
      parsed.categories.push({ name, articles: [] })
    }
  }

  parsed.totalArticles = parsed.categories.reduce((sum, c) => sum + c.articles.length, 0)

  return parsed
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(204).end()

  if (!process.env.DASHSCOPE_API_KEY) {
    return res.status(500).json({ error: 'DASHSCOPE_API_KEY environment variable is not set' })
  }

  const today = getTodayCN()
  const forceRefresh = req.query.refresh === 'true' || req.headers['x-cron-refresh'] === '1'
  const kvKey = `${KV_KEY_PREFIX}${today}`

  // 1. 非强制刷新时，先读持久化缓存（Vercel KV），8 点定时任务写入的数据全天可读
  if (!forceRefresh) {
    try {
      const cached = await kv.get<DailyReportData>(kvKey)
      if (cached && typeof cached === 'object' && cached.date && cached.categories) {
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
        res.setHeader('X-Cache', 'KV-HIT')
        return res.json(cached)
      }
    } catch (e) {
      // KV 未配置或不可用时仅打日志，继续走生成逻辑
      console.warn('[daily-report] KV get failed:', e)
    }
    // 同实例内存缓存兜底
    if (memoryCache && memoryCache.date === today) {
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
      res.setHeader('X-Cache', 'MEMORY-HIT')
      return res.json(memoryCache.report)
    }
  }

  try {
    const report = await generateReport()
    memoryCache = { date: today, report }

    // 2. 写入 KV，供后续请求（含当天用户访问）直接命中
    try {
      await kv.set(kvKey, report)
    } catch (e) {
      console.warn('[daily-report] KV set failed:', e)
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    res.setHeader('X-Cache', 'MISS')
    return res.json(report)
  } catch (error) {
    console.error('[daily-report] Error generating report:', error)

    if (memoryCache) {
      res.setHeader('X-Cache', 'STALE')
      return res.json(memoryCache.report)
    }

    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate daily report',
    })
  }
}

export const config = {
  maxDuration: 60,
}
