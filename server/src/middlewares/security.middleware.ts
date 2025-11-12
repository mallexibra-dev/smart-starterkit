import type { Context, Next } from 'hono'

export const securityHeaders = () => async (c: Context, next: Next) => {
  // Security headers
  c.res.headers.set('X-Content-Type-Options', 'nosniff')
  c.res.headers.set('X-Frame-Options', 'DENY')
  c.res.headers.set('X-XSS-Protection', '1; mode=block')
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')

  c.res.headers.set('Content-Security-Policy', csp)

  await next()
}

export const noCache = () => async (c: Context, next: Next) => {
  c.res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  c.res.headers.set('Pragma', 'no-cache')
  c.res.headers.set('Expires', '0')

  await next()
}