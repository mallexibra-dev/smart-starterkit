import type { Context, Next } from 'hono'
import { validator } from 'hono/validator'
import type { ZodSchema } from 'zod'

export const validateJson = <T>(schema: ZodSchema<T>) =>
  validator('json', (value, c) => {
    const parsed = schema.safeParse(value)
    if (!parsed.success) {
      return c.json({ success: false, message: 'Validasi gagal', errors: parsed.error.flatten() }, 422)
    }
    return parsed.data
  })

export const requireBearer = () => async (c: Context, next: Next) => {
  const auth = c.req.header('authorization') || c.req.header('Authorization')
  if (!auth) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
  const parts = auth.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
  await next()
}
