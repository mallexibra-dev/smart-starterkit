import { OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { AuthController } from '../controllers/auth.controller'
import { loginSchema, registerSchema, refreshTokenSchema } from '../schemas/auth.schema'
import { requireBearer } from '../middlewares/validations.middleware'

const app = new OpenAPIHono()

const authController = new AuthController()

// Define OpenAPI documentation
app.openapiRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email(),
            password: z.string()
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              user: z.object({
                id: z.number(),
                name: z.string(),
                email: z.string(),
                role: z.string(),
                status: z.string()
              }),
              token: z.string(),
              expiresIn: z.number()
            })
          })
        }
      }
    }
  }
})

app.post('/login', validateJson(loginSchema), authController.login)

app.openapiRoute({
  method: 'post',
  path: '/register',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
            confirmPassword: z.string()
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Registration successful',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              user: z.object({
                id: z.number(),
                name: z.string(),
                email: z.string(),
                role: z.string(),
                status: z.string()
              }),
              token: z.string(),
              expiresIn: z.number()
            })
          })
        }
      }
    }
  }
})

app.post('/register', validateJson(registerSchema), authController.register)

app.post('/refresh', validateJson(refreshTokenSchema), authController.refreshToken)

app.post('/logout', authController.logout)

app.get('/profile', requireBearer(), authController.getProfile)

export default app