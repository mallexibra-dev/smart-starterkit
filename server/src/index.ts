import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
import routes from './routes'
import { requestLogger } from './middlewares/logs.middleware'

const app = new OpenAPIHono()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowMethods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))
app.use('*', requestLogger)

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

export default app

