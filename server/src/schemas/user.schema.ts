import { z } from '@hono/zod-openapi'

export const User = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Alice Example' }),
  username: z.string().openapi({ example: 'alice' }),
  email: z.string().nullable().openapi({ example: 'alice@example.com' }),
  created_at: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updated_at: z.string().nullable().openapi({ example: '2024-01-01T00:00:00.000Z' }),
}).openapi('User')

export const Base = z.object({
  success: z.boolean(),
  message: z.string().openapi({ example: 'OK' }),
}).openapi('Base')

export const BaseOk = Base
export const BaseError = Base

export const UsersOk = BaseOk.extend({ 
  data: z.array(User) 
}).openapi('UsersOk')
