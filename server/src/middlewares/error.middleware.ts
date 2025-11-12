import type { Context, Next } from 'hono'
import logger from '../../utils/logger'

export const errorHandler = () => async (c: Context, next: Next) => {
  try {
    await next()
  } catch (error) {
    logger.error('Unhandled error:', error)

    // Check if it's a validation error
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors: error
      }, 400)
    }

    // Check if it's a JWT error
    if (error && typeof error === 'object' && 'name' in error && error.name === 'JsonWebTokenError') {
      return c.json({
        success: false,
        message: 'Invalid authentication token'
      }, 401)
    }

    // Check if response already has status (some errors might have been handled)
    if (c.res.status < 400) {
      return c.json({
        success: false,
        message: process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }, 500)
    }
  }
}

export const notFoundHandler = () => async (c: Context, next: Next) => {
  await next()

  if (c.res.status === 404) {
    return c.json({
      success: false,
      message: 'Endpoint not found'
    }, 404)
  }
}