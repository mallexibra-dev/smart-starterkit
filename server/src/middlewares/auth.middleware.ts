import type { Context, Next } from 'hono'
import AuthService, { type JWTPayload } from '../lib/auth'

export interface AuthContext {
  user: JWTPayload
}

export const requireAuth = () => async (c: Context, next: Next) => {
  try {
    const token = AuthService.extractTokenFromCookie(c.req.header('cookie'))

    if (!token) {
      return c.json({
        success: false,
        message: 'Authentication required. Please login.',
      }, 401)
    }

    const payload = AuthService.verifyToken(token)

    if (!payload) {
      return c.json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      }, 401)
    }

    // Attach user payload to context for use in route handlers
    c.set('user', payload)

    await next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return c.json({
      success: false,
      message: 'Authentication failed.',
    }, 500)
  }
}

export const optionalAuth = () => async (c: Context, next: Next) => {
  try {
    const token = AuthService.extractTokenFromCookie(c.req.header('cookie'))

    if (token) {
      const payload = AuthService.verifyToken(token)
      if (payload) {
        c.set('user', payload)
      }
    }

    await next()
  } catch (error) {
    // For optional auth, we don't fail the request if auth fails
    console.error('Optional auth middleware error:', error)
    await next()
  }
}

// Helper to get authenticated user from context
export const getAuthUser = (c: Context): JWTPayload | null => {
  return c.get('user') || null
}

// Helper to check if user is authenticated
export const isAuthenticated = (c: Context): boolean => {
  return !!c.get('user')
}