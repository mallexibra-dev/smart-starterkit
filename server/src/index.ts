import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
import routes from './route'
import {
  requestLogger
} from './middlewares/logs.middleware'
import {
  errorHandler,
  notFoundHandler
} from './middlewares/error.middleware'
import {
  securityHeaders
} from './middlewares/security.middleware'
import {
  apiRateLimit
} from './middlewares/rate-limit.middleware'

const app = new OpenAPIHono()

// Global middleware (applied to all routes)
app.use('*', securityHeaders())
app.use('*', errorHandler())
app.use('*', requestLogger)

// CORS configuration
app.use('*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowMethods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))

// Rate limiting for API routes
app.use('/api/*', apiRateLimit())

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT'
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.doc('/api/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Smart Starterkit API',
    version: '1.0.0'
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local' },
    { url: 'https://api.example.com', description: 'Production' }
  ]
})

app.get('/api/docs', swaggerUI({ url: '/api/openapi.json', persistAuthorization: true }))

app.route('/api', routes)

// Handle 404s for API routes
app.use('/api/*', notFoundHandler())

export default app

