import { Request, Response, NextFunction } from 'express'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 500

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 60_000).unref()

export function rateLimit(maxRequests = MAX_REQUESTS, windowMs = WINDOW_MS) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip ?? req.socket.remoteAddress ?? 'unknown'
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + windowMs })
      next()
      return
    }

    entry.count++
    if (entry.count > maxRequests) {
      res.status(429).json({
        error: {
          message: 'Too many requests. Please try again later.',
          statusCode: 429,
        },
      })
      return
    }

    next()
  }
}
