import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from '../cron/refresh'

// Mock modules
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))

// Helper to create mock request
function createMockRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'GET',
    headers: {},
    query: {},
    body: undefined,
    ...overrides,
  } as VercelRequest
}

// Helper to create mock response
function createMockResponse(): VercelResponse & {
  _status: number
  _json: any
  _body: string
  status: vi.Mock
  json: vi.Mock
  end: vi.Mock
  setHeader: vi.Mock
} {
  const res = {
    _status: 200,
    _json: null,
    _body: '',
    status: vi.fn(function (this: any, code: number) {
      this._status = code
      return this
    }),
    json: vi.fn(function (this: any, data: any) {
      this._json = data
      return this
    }),
    end: vi.fn(function (this: any) {
      return this
    }),
    setHeader: vi.fn(function (this: any) {
      return this
    }),
    ...{},
  } as any
  return res
}

describe('Auth - Cron Refresh Endpoint', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Authorization', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const req = createMockRequest({
        headers: {},
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should return 401 when authorization header is empty', async () => {
      const req = createMockRequest({
        headers: { authorization: '' },
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should return 401 when authorization header does not have Bearer prefix', async () => {
      process.env.CRON_SECRET = 'test-secret'
      const req = createMockRequest({
        headers: { authorization: 'test-secret' },
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should return 401 when authorization token is incorrect', async () => {
      process.env.CRON_SECRET = 'correct-secret'
      const req = createMockRequest({
        headers: { authorization: 'Bearer wrong-secret' },
      })
      const res = createMockResponse()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should pass authorization when header matches Bearer token correctly', async () => {
      process.env.CRON_SECRET = 'test-secret'
      process.env.VERCEL_URL = 'test-app.vercel.app'

      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      // Mock fetch to simulate successful upstream call
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ date: '2026-03-09', totalArticles: 30 }),
      })

      await handler(req, res)

      // Should not return 401
      expect(res.status).not.toHaveBeenCalledWith(401)
      expect(res.json).not.toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should handle case-sensitive authorization header', async () => {
      process.env.CRON_SECRET = 'test-secret'
      const req = createMockRequest({
        headers: { Authorization: 'Bearer test-secret' } as any, // Capital A
      })
      const res = createMockResponse()

      await handler(req, res)

      // The current implementation is case-sensitive, so this should fail
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should return 401 when CRON_SECRET is not set', async () => {
      delete process.env.CRON_SECRET
      const req = createMockRequest({
        headers: { authorization: 'Bearer anything' },
      })
      const res = createMockResponse()

      await handler(req, res)

      // When CRON_SECRET is undefined, the check becomes "Bearer undefined"
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should pass authorization with correct Bearer token', async () => {
      process.env.CRON_SECRET = 'my-secret-token'
      const req = createMockRequest({
        headers: { authorization: 'Bearer my-secret-token' },
      })
      const res = createMockResponse()

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ date: '2026-03-09', totalArticles: 25 }),
      })

      await handler(req, res)

      expect(res.status).not.toHaveBeenCalledWith(401)
    })
  })

  describe('Upstream Request', () => {
    beforeEach(() => {
      process.env.CRON_SECRET = 'test-secret'
    })

    it('should use VERCEL_URL when available', async () => {
      process.env.VERCEL_URL = 'my-app.vercel.app'
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ date: '2026-03-09', totalArticles: 30 }),
      })

      await handler(req, res)

      expect(global.fetch).toHaveBeenCalledWith('https://my-app.vercel.app/api/daily-report', {
        headers: { 'x-cron-refresh': '1' },
      })
    })

    it('should use localhost with PORT when VERCEL_URL is not available', async () => {
      delete process.env.VERCEL_URL
      process.env.PORT = '4000'
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ date: '2026-03-09', totalArticles: 30 }),
      })

      await handler(req, res)

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/daily-report', {
        headers: { 'x-cron-refresh': '1' },
      })
    })

    it('should use default port 3000 when PORT is not set', async () => {
      delete process.env.VERCEL_URL
      delete process.env.PORT
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ date: '2026-03-09', totalArticles: 30 }),
      })

      await handler(req, res)

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/daily-report', {
        headers: { 'x-cron-refresh': '1' },
      })
    })

    it('should send x-cron-refresh header', async () => {
      process.env.VERCEL_URL = 'test-app.vercel.app'
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ date: '2026-03-09', totalArticles: 30 }),
      })

      await handler(req, res)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { 'x-cron-refresh': '1' },
        })
      )
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      process.env.CRON_SECRET = 'test-secret'
      process.env.VERCEL_URL = 'test-app.vercel.app'
    })

    it('should return 502 when upstream returns error status', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      })

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(502)
      expect(res.json).toHaveBeenCalledWith({ error: 'Upstream error', status: 500 })
    })

    it('should return 500 when fetch throws an error', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Network error' })
    })

    it('should return 500 with generic message for unknown errors', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      global.fetch = vi.fn().mockRejectedValue('string error')

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unknown error' })
    })
  })

  describe('Successful Request', () => {
    beforeEach(() => {
      process.env.CRON_SECRET = 'test-secret'
      process.env.VERCEL_URL = 'test-app.vercel.app'
    })

    it('should return success response with report data', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      const mockReport = { date: '2026-03-09', totalArticles: 42 }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockReport,
      })

      await handler(req, res)

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        date: '2026-03-09',
        totalArticles: 42,
      })
    })

    it('should log success message', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      })
      const res = createMockResponse()

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ date: '2026-03-09', totalArticles: 30 }),
      })

      const consoleSpy = vi.spyOn(console, 'log')
      await handler(req, res)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[cron/refresh] Report refreshed successfully, date:',
        '2026-03-09'
      )
      consoleSpy.mockRestore()
    })
  })
})
