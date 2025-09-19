import type { Context, Next } from 'hono'
import logger from '../../utils/logger'

export const requestLogger = async (c: Context, next: Next) => {
  const start = Date.now()
  const { method, url } = c.req
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || c.req.raw?.headers.get('x-forwarded-for') || 'unknown'

  try {
    await next()
  } finally {
    const durationMs = Date.now() - start
    const status = c.res.status
    logger.info(`${method} ${url} ${status} ${durationMs}ms`, { method, url, status, durationMs, ip })
  }
}

export default requestLogger
