import { z } from '@hono/zod-openapi'

import { Category } from './category.schema'
import { BaseOk, BaseError } from './base.schema'
import type { Product as ProductType, CreateProductData, UpdateProductData } from '../../../shared/src/types/products.type'
import { ProductStatus } from '../../../shared/src/constants/product.constants'

// Category response schemas (needed for category routes)
export const CategoriesOk = BaseOk.extend({
  data: z.array(Category)
}).openapi('CategoriesOk')

export const CategoryOk = BaseOk.extend({
  data: Category
}).openapi('CategoryOk')

// Product schema that matches shared types with OpenAPI documentation
export const Product = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Laptop Pro 15"' }),
  description: z.string().nullable().openapi({ example: 'High-performance laptop with 16GB RAM and 512GB SSD' }),
  price: z.number().openapi({ example: 1299.99 }),
  category_id: z.number().openapi({ example: 1 }),
  category: Category.optional().openapi({ example: null }),
  status: z.nativeEnum(ProductStatus).openapi({ example: ProductStatus.ACTIVE }),
  sku: z.string().openapi({ example: 'LAP-PRO-15-001' }),
  stock_quantity: z.number().openapi({ example: 50 }),
  min_stock_level: z.number().openapi({ example: 10 }),
  weight: z.number().nullable().openapi({ example: 1.5 }),
  dimensions: z.string().nullable().openapi({ example: '35.5 x 23.5 x 1.8 cm' }),
  images: z.array(z.string()).nullable().openapi({ example: ['https://example.com/laptop1.jpg', 'https://example.com/laptop2.jpg'] }),
  tags: z.array(z.string()).nullable().openapi({ example: ['laptop', 'computer', 'work'] }),
  created_at: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updated_at: z.string().nullable().openapi({ example: '2024-01-01T00:00:00.000Z' }),
}).openapi('Product') as z.ZodType<ProductType>

export const CreateProduct = z.object({
  name: z.string().min(1).openapi({ example: 'Laptop Pro 15"' }),
  description: z.string().optional().openapi({ example: 'High-performance laptop with 16GB RAM and 512GB SSD' }),
  price: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error('Invalid price');
    return num;
  }).pipe(z.number().positive()).openapi({ example: 1299.99 }),
  category_id: z.number().positive().openapi({ example: 1 }),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT).openapi({ example: ProductStatus.DRAFT }),
  sku: z.string().min(1).openapi({ example: 'LAP-PRO-15-001' }),
  stock_quantity: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val);
    if (isNaN(num)) throw new Error('Invalid stock quantity');
    return num;
  }).pipe(z.number().min(0)).default(0).openapi({ example: 50 }),
  min_stock_level: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val);
    if (isNaN(num)) throw new Error('Invalid min stock level');
    return num;
  }).pipe(z.number().min(0)).default(0).openapi({ example: 10 }),
  weight: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === undefined || val === null) return null;
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() === '') return null;
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error('Invalid weight');
    return num;
  }).pipe(z.number().positive().nullable()).openapi({ example: 1.5 }),
  dimensions: z.string().optional().openapi({ example: '35.5 x 23.5 x 1.8 cm' }),
  images: z.array(z.string()).optional().openapi({ example: ['https://example.com/laptop1.jpg'] }),
  tags: z.array(z.string()).optional().openapi({ example: ['laptop', 'computer', 'work'] }),
}).openapi('CreateProduct') as z.ZodType<CreateProductData>

export const UpdateProduct = z.object({
  name: z.string().min(1).optional().openapi({ example: 'Laptop Pro 15"' }),
  description: z.string().optional().openapi({ example: 'High-performance laptop with 16GB RAM and 512GB SSD' }),
  price: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error('Invalid price');
    return num;
  }).pipe(z.number().positive()).optional().openapi({ example: 1299.99 }),
  category_id: z.number().positive().optional().openapi({ example: 1 }),
  status: z.nativeEnum(ProductStatus).optional().openapi({ example: ProductStatus.ACTIVE }),
  sku: z.string().min(1).optional().openapi({ example: 'LAP-PRO-15-001' }),
  stock_quantity: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val);
    if (isNaN(num)) throw new Error('Invalid stock quantity');
    return num;
  }).pipe(z.number().min(0)).optional().openapi({ example: 50 }),
  min_stock_level: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val);
    if (isNaN(num)) throw new Error('Invalid min stock level');
    return num;
  }).pipe(z.number().min(0)).optional().openapi({ example: 10 }),
  weight: z.union([z.string(), z.number()]).transform((val) => {
    if (val === undefined || val === null) return null;
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() === '') return null;
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error('Invalid weight');
    return num;
  }).pipe(z.number().positive().nullable()).optional().openapi({ example: 1.5 }),
  dimensions: z.string().optional().openapi({ example: '35.5 x 23.5 x 1.8 cm' }),
  images: z.array(z.string()).optional().openapi({ example: ['https://example.com/laptop1.jpg'] }),
  tags: z.array(z.string()).optional().openapi({ example: ['laptop', 'computer', 'work'] }),
}).openapi('UpdateProduct') as z.ZodType<UpdateProductData>

export const RestockProduct = z.object({
  quantity: z.number().positive().openapi({ example: 50 })
}).openapi('RestockProduct')

export const Base = z.object({
  success: z.boolean(),
  message: z.string().openapi({ example: 'OK' }),
}).openapi('Base')

export const ProductsOk = BaseOk.extend({
  data: z.array(Product)
}).openapi('ProductsOk')

export const ProductOk = BaseOk.extend({
  data: Product
}).openapi('ProductOk')

export const ProductCreated = BaseOk.extend({
  data: Product
}).openapi('ProductCreated')

export const ProductUpdated = BaseOk.extend({
  data: Product
}).openapi('ProductUpdated')

export const ProductDeleted = BaseOk.extend({
  data: z.null()
}).openapi('ProductDeleted')

// Query parameters for listing products
export const ProductQuery = z.object({
  page: z.preprocess((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val as string);
    return isNaN(num) ? 1 : num;
  }, z.number().default(1)).openapi({ example: 1 }),
  limit: z.preprocess((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val as string);
    return isNaN(num) ? 10 : num;
  }, z.number().default(10)).openapi({ example: 10 }),
  category_id: z.preprocess((val) => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === 'number') return val;
    const num = parseInt(val as string);
    return isNaN(num) ? undefined : num;
  }, z.number().optional()).openapi({ example: 1 }),
  category_slug: z.string().optional().openapi({ example: 'electronics' }),
  status: z.string().optional().openapi({ example: 'active' }),
  search: z.string().optional().openapi({ example: 'laptop' }),
  sort_by: z.enum(['name', 'price', 'created_at', 'updated_at']).default('created_at').openapi({ example: 'created_at' }),
  sort_order: z.enum(['asc', 'desc']).default('desc').openapi({ example: 'desc' }),
}).openapi('ProductQuery')

// Query parameters for filtering by category
export const CategoryParams = z.object({
  category_slug: z.string().openapi({ example: 'electronics' }),
}).openapi('CategoryParams')

export const ProductListResponse = BaseOk.extend({
  data: z.array(Product),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    total_pages: z.number(),
  }),
}).openapi('ProductListResponse')

export const ProductStats = z.object({
  total_products: z.number().openapi({ example: 100 }),
  low_stock: z.number().openapi({ example: 5 }),
  out_of_stock: z.number().openapi({ example: 2 }),
  active: z.number().openapi({ example: 80 }),
}).openapi('ProductStats')

export const ProductStatsResponse = BaseOk.extend({
  data: ProductStats,
}).openapi('ProductStatsResponse')

// Low Stock Products Response
export const LowStockProductsResponse = BaseOk.extend({
  data: z.array(Product),
}).openapi('LowStockProductsResponse')

// Activate/Deactivate response schemas
export const ProductActivated = BaseOk.extend({
  data: Product
}).openapi('ProductActivated')

export const ProductDeactivated = BaseOk.extend({
  data: Product
}).openapi('ProductDeactivated')