import type { Context, Next } from 'hono'
import { validator } from 'hono/validator'
import type { ZodSchema } from 'zod'
import { validateData, transformZodErrors } from '../../../shared/src/utils/validation.utils'
import { createValidationErrorResponse, createUnauthorizedResponse } from '../../../shared/src/utils/api.utils'

export const validateJson = <T>(schema: ZodSchema<T>) =>
  validator('json', (value, c) => {
    const result = validateData(schema, value)
    if (!result.success) {
      const errors = transformZodErrors(result.errors)
      return c.json(createValidationErrorResponse(errors), 422)
    }
    return result.data
  })

export const requireBearer = () => async (c: Context, next: Next) => {
  const auth = c.req.header('authorization') || c.req.header('Authorization')
  if (!auth) {
    return c.json(createUnauthorizedResponse(), 401)
  }
  const parts = auth.trim().split(/\s+/) // Split on any whitespace
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return c.json(createUnauthorizedResponse(), 401)
  }
  await next()
}
