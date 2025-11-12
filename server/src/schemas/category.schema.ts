import { z } from '@hono/zod-openapi'

export const Category = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Electronics' }),
  description: z.string().nullable().openapi({ example: 'Electronic devices and accessories' }),
  status: z.enum(['active', 'inactive']).openapi({ example: 'active' }),
  created_at: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updated_at: z.string().nullable().openapi({ example: '2024-01-01T00:00:00.000Z' }),
}).openapi('Category')

export const CreateCategory = z.object({
  name: z.string().min(1).openapi({ example: 'Electronics' }),
  description: z.string().optional().openapi({ example: 'Electronic devices and accessories' }),
  status: z.enum(['active', 'inactive']).default('active').openapi({ example: 'active' }),
}).openapi('CreateCategory')

export const UpdateCategory = z.object({
  name: z.string().min(1).optional().openapi({ example: 'Electronics' }),
  description: z.string().optional().openapi({ example: 'Electronic devices and accessories' }),
  status: z.enum(['active', 'inactive']).optional().openapi({ example: 'active' }),
}).openapi('UpdateCategory')

export const Base = z.object({
  success: z.boolean(),
  message: z.string().openapi({ example: 'OK' }),
}).openapi('Base')

export const BaseOk = Base
export const BaseError = Base

export const CategoriesOk = BaseOk.extend({
  data: z.array(Category)
}).openapi('CategoriesOk')

export const CategoryOk = BaseOk.extend({
  data: Category
}).openapi('CategoryOk')