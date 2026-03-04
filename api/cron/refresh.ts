import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Cron endpoint called daily at 08:00 CST (00:00 UTC).
 * It triggers a forced refresh of the daily report so the first
 * real user request of the day is served from cache.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel Cron sends this header automatically on Pro/Enterprise plans
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT ?? 3000}`

    const response = await fetch(`${baseUrl}/api/daily-report`, {
      headers: { 'x-cron-refresh': '1' },
    })

    if (!response.ok) {
      const body = await response.text()
      console.error('[cron/refresh] daily-report returned', response.status, body)
      return res.status(502).json({ error: 'Upstream error', status: response.status })
    }

    const report = await response.json()
    console.log('[cron/refresh] Report refreshed successfully, date:', report.date)
    return res.json({ ok: true, date: report.date, totalArticles: report.totalArticles })
  } catch (error) {
    console.error('[cron/refresh] Failed:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const config = {
  maxDuration: 60,
}
