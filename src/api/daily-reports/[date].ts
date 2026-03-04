import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // 只允许 GET 请求
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  // 从 URL 路径获取日期参数
  const { date } = request.query

  if (!date || typeof date !== 'string') {
    return response.status(400).json({ error: 'Date parameter is required' })
  }

  // 验证日期格式 (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return response.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' })
  }

  // 获取今日日期
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // 如果请求的是今天的日报，代理到 daily-report
  if (date === todayStr) {
    try {
      // 通过 HTTP 请求获取日报
      const protocol = request.headers['x-forwarded-proto'] || 'https'
      const host = request.headers.host
      const res = await fetch(`${protocol}://${host}/api/daily-report`)
      const data = await res.json()
      return response.status(res.status).json(data)
    } catch (e) {
      console.error('Error proxying to daily-report:', e)
      return response.status(500).json({ error: 'Failed to fetch report' })
    }
  }

  // 对于历史日期，返回提示信息
  // 注意：在 Vercel 上实现真正的历史数据存储需要额外的存储方案
  // 这里返回 404 或提示用户
  return response.status(404).json({
    error: 'Report not found',
    message: `No report found for ${date}. Currently only today's report is available.`,
    note: 'Historical reports require additional storage configuration.'
  })
}