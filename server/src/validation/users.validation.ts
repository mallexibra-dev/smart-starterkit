import { z } from 'zod'

export const createUserValidation = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export const validateBody = (schema: z.ZodTypeAny) => {
  return async (c: any, next: any) => {
    try {
      const body = await c.req.json()
      const parsed = schema.safeParse(body)
      if (!parsed.success) {
        const errors = parsed.error.issues.map((issue) => ({
          field: issue.path.join('.') || '',
          message: issue.message,
        }))
        return c.json({ message: 'Validation error', success: false, data: errors }, 400)
      }
      c.set('validatedBody', parsed.data)
      await next()
    } catch (e) {
      return c.json({ message: 'Invalid JSON body', success: false, data: [{ field: '', message: 'Invalid JSON' }] }, 400)
    }
  }
}