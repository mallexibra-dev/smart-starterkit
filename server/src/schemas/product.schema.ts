import { z } from '@hono/zod-openapi'

export const Product = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Laptop Gaming ASUS' }),
  description: z.string().nullable().openapi({ example: 'High performance gaming laptop with RTX 4060' }),
  price: z.number().openapi({ example: 15000000.00 }),
  stock: z.number().openapi({ example: 25 }),
  category: z.string().nullable().openapi({ example: 'Electronics' }),
  sku: z.string().nullable().openapi({ example: 'ASUS-GAM-001' }),
  status: z.enum(['active', 'inactive']).openapi({ example: 'active' }),
  created_at: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updated_at: z.string().nullable().openapi({ example: '2024-01-01T00:00:00.000Z' }),
}).openapi('Product')

export const CreateProduct = z.object({
  name: z.string().min(1).openapi({ example: 'Laptop Gaming ASUS' }),
  description: z.string().optional().openapi({ example: 'High performance gaming laptop with RTX 4060' }),
  price: z.number().positive().openapi({ example: 15000000.00 }),
  stock: z.number().min(0).openapi({ example: 25 }),
  category: z.string().optional().openapi({ example: 'Electronics' }),
  sku: z.string().optional().openapi({ example: 'ASUS-GAM-001' }),
  status: z.enum(['active', 'inactive']).default('active').openapi({ example: 'active' }),
}).openapi('CreateProduct')

export const UpdateProduct = z.object({
  name: z.string().min(1).optional().openapi({ example: 'Laptop Gaming ASUS' }),
  description: z.string().optional().openapi({ example: 'High performance gaming laptop with RTX 4060' }),
  price: z.number().positive().optional().openapi({ example: 15000000.00 }),
  stock: z.number().min(0).optional().openapi({ example: 25 }),
  category: z.string().optional().openapi({ example: 'Electronics' }),
  sku: z.string().optional().openapi({ example: 'ASUS-GAM-001' }),
  status: z.enum(['active', 'inactive']).optional().openapi({ example: 'active' }),
}).openapi('UpdateProduct')

export const Base = z.object({
  success: z.boolean(),
  message: z.string().openapi({ example: 'OK' }),
}).openapi('Base')

export const BaseOk = Base
export const BaseError = Base

export const ProductsOk = BaseOk.extend({ 
  data: z.array(Product) 
}).openapi('ProductsOk')

export const ProductOk = BaseOk.extend({ 
  data: Product 
}).openapi('ProductOk')
