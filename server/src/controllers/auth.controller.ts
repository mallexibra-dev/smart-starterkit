import { Context } from 'hono'
import { authService } from '../services/auth.service'
import { createSuccessResponse, createErrorResponse } from '../../../shared/src/utils/api.utils'
import type { LoginBody, RegisterBody, RefreshTokenBody } from '../schemas/auth.schema'

export class AuthController {
  async login(c: Context) {
    try {
      const body = await c.req.json() as LoginBody
      const result = await authService.login(body)

      return c.json(createSuccessResponse(result, 'Login successful'))
    } catch (error) {
      console.error('Login error:', error)
      if (error instanceof Error) {
        return c.json(createErrorResponse(null, error.message, 401))
      }
      return c.json(createErrorResponse(null, 'Login failed', 500))
    }
  }

  async register(c: Context) {
    try {
      const body = await c.req.json() as RegisterBody
      const result = await authService.register(body)

      return c.json(createSuccessResponse(result, 'Registration successful'))
    } catch (error) {
      console.error('Registration error:', error)
      if (error instanceof Error) {
        return c.json(createErrorResponse(null, error.message, 400))
      }
      return c.json(createErrorResponse(null, 'Registration failed', 500))
    }
  }

  async refreshToken(c: Context) {
    try {
      const body = await c.req.json() as RefreshTokenBody
      const result = await authService.refreshToken(body.refreshToken)

      return c.json(createSuccessResponse(result, 'Token refreshed successfully'))
    } catch (error) {
      console.error('Token refresh error:', error)
      if (error instanceof Error) {
        return c.json(createErrorResponse(null, error.message, 401))
      }
      return c.json(createErrorResponse(null, 'Token refresh failed', 500))
    }
  }

  async logout(c: Context) {
    try {
      // In a real app, you might want to invalidate the token on the server side
      // For now, we'll just return success since JWT is stateless
      return c.json(createSuccessResponse(null, 'Logout successful'))
    } catch (error) {
      console.error('Logout error:', error)
      return c.json(createErrorResponse(null, 'Logout failed', 500))
    }
  }

  async getProfile(c: Context) {
    try {
      // This would require extracting user from token in middleware
      // For now, return a mock response
      return c.json(createSuccessResponse({
        message: 'Profile endpoint - implement with middleware authentication'
      }))
    } catch (error) {
      console.error('Profile error:', error)
      return c.json(createErrorResponse(null, 'Failed to get profile', 500))
    }
  }
}