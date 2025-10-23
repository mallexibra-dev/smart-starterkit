import { z } from '@hono/zod-openapi'

// Base response schemas
export const BaseOk = z.object({
  success: z.boolean(),
  message: z.string(),
}).openapi('BaseOk')

export const BaseError = BaseOk.extend({
  success: z.literal(false),
}).openapi('BaseError')

// Base schema for creating data with BaseOk
export const BaseDataResponse = <T>(dataSchema: z.ZodType<T>) => {
  return BaseOk.extend({
    data: dataSchema
  })
}