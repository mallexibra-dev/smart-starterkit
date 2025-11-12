import type { Context, Next } from 'hono'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export const rateLimit = (options: {
  windowMs?: number
  max?: number
  message?: string
}) => {
  const {
    windowMs = 60 * 1000, // 1 minute
    max = 100, // 100 requests per window
    message = 'Too many requests, please try again later.'
  } = options

  return async (c: Context, next: Next) => {
    if (!c.req) {
      await next()
      return
    }

    const key = `rate_limit_${c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'}`
    const now = Date.now()

    // Clean up expired entries
    if (store[key] && store[key].resetTime < now) {
      delete store[key]
    }

    // Check if rate limit exceeded
    if (store[key]) {
      if (store[key].count >= max) {
        const resetTime = Math.ceil((store[key].resetTime - now) / 1000)
        c.res.headers.set('X-RateLimit-Limit', max.toString())
        c.res.headers.set('X-RateLimit-Remaining', '0')
        c.res.headers.set('X-RateLimit-Reset', resetTime.toString())

        return c.json({
          success: false,
          message,
          retryAfter: resetTime
        }, 429)
      }
      store[key].count++
    } else {
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      }
    }

    // Set rate limit headers
    const remaining = Math.max(0, max - store[key].count)
    c.res.headers.set('X-RateLimit-Limit', max.toString())
    c.res.headers.set('X-RateLimit-Remaining', remaining.toString())
    c.res.headers.set('X-RateLimit-Reset', Math.ceil((store[key].resetTime - now) / 1000).toString())

    await next()
  }
}

// Stricter rate limit for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later.'
})

// General API rate limit
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later.'
})