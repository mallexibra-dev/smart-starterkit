import { z } from '@hono/zod-openapi'
import { BaseOk } from './base.schema'
import type { Category as CategoryType } from '../../../shared/src/types/products.type'
import { CategoryStatus } from '../../../shared/src/constants/product.constants'

// Category schema that matches shared types with OpenAPI documentation
export const Category = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Electronics' }),
  slug: z.string().openapi({ example: 'electronics' }),
  description: z.string().nullable().openapi({ example: 'Electronic devices, gadgets, and technology products' }),
  icon: z.string().nullable().openapi({ example: 'laptop' }),
  color: z.string().nullable().openapi({ example: 'blue' }),
  sort_order: z.number().openapi({ example: 1 }),
  status: z.nativeEnum(CategoryStatus).openapi({ example: CategoryStatus.ACTIVE }),
  created_at: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updated_at: z.string().nullable().openapi({ example: '2024-01-01T00:00:00.000Z' }),
}).openapi('Category') as z.ZodType<CategoryType>

// Schema for creating category
export const CreateCategory = z.object({
  name: z.string().min(1).openapi({ example: 'Electronics' }),
  slug: z.string().min(1).openapi({ example: 'electronics' }),
  description: z.string().optional().openapi({ example: 'Electronic devices and gadgets' }),
  icon: z.string().optional().openapi({ example: 'laptop' }),
  color: z.string().optional().openapi({ example: 'blue' }),
  sort_order: z.number().optional().openapi({ example: 1 }),
  status: z.nativeEnum(CategoryStatus).default(CategoryStatus.ACTIVE).openapi({ example: CategoryStatus.ACTIVE }),
}).openapi('CreateCategory')

// Schema for updating category
export const UpdateCategory = CreateCategory.partial().openapi('UpdateCategory')

// Schema for updating sort order
export const UpdateSortOrder = z.object({
  categories: z.array(z.object({
    id: z.number(),
    sort_order: z.number()
  })).openapi({ example: [{ id: 1, sort_order: 1 }, { id: 2, sort_order: 2 }] })
}).openapi('UpdateSortOrder')

// Category statistics schema
export const CategoryStats = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Electronics' }),
  slug: z.string().openapi({ example: 'electronics' }),
  color: z.string().nullable().openapi({ example: 'blue' }),
  product_count: z.number().openapi({ example: 15 }),
  low_stock_count: z.number().openapi({ example: 3 }),
  out_of_stock_count: z.number().openapi({ example: 1 }),
  total_value: z.number().openapi({ example: 15000.00 }),
}).openapi('CategoryStats')

// Category stats response schema
export const CategoryStatsOk = BaseOk.extend({
  data: z.array(CategoryStats)
}).openapi('CategoryStatsOk')