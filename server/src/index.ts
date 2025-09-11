import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared/dist'
import routes from './route'

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', async (c) => {

  const data: ApiResponse = {
    message: "Hello Smart Starterkit!",
    success: true
  }

  return c.json(data, { status: 200 })
})

app.route('/api', routes)

export default app
