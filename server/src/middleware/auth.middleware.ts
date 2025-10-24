// Example: Authentication Middleware
// This is a template - customize for your needs

import { Context, Next } from 'hono'

export interface AuthContext {
  userId?: string
  user?: any
}

export const authMiddleware = async (c: Context, next: Next) => {
  // Implement your authentication logic here
  // Example: Check for JWT token, API key, etc.

  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    return c.json({ error: 'No authorization header' }, 401)
  }

  try {
    // Verify token, extract user info, etc.
    // const token = authHeader.replace('Bearer ', '')
    // const decoded = await verifyJWT(token)

    // Add user to context
    // c.set('userId', decoded.userId)
    // c.set('user', decoded.user)

    await next()
  } catch (error) {
    return c.json({ error: 'Invalid authentication' }, 401)
  }
}