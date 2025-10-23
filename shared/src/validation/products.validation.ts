import { z } from 'zod';

// Base validation schemas
export const BaseOkSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const BaseErrorSchema = BaseOkSchema.extend({
  success: z.literal(false),
});

// Product validation schemas
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  category_id: z.number(),
  category: z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    icon: z.string().nullable(),
    color: z.string().nullable(),
    sort_order: z.number(),
    status: z.enum(['active', 'inactive']),
    created_at: z.string(),
    updated_at: z.string().nullable(),
  }).optional().nullable(),
  status: z.enum(['active', 'inactive', 'draft', 'archived']),
  sku: z.string(),
  stock_quantity: z.number(),
  min_stock_level: z.number(),
  weight: z.number().nullable(),
  dimensions: z.string().nullable(),
  images: z.array(z.string()).nullable(),
  tags: z.array(z.string()).nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error('Invalid price');
    return num;
  }).pipe(z.number().positive('Price must be positive')),
  category_id: z.number().positive('Category ID must be positive'),
  status: z.enum(['active', 'inactive', 'draft', 'archived']).default('draft'),
  sku: z.string().min(1, 'SKU is required'),
  stock_quantity: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val);
    if (isNaN(num)) throw new Error('Invalid stock quantity');
    return num;
  }).pipe(z.number().min(0, 'Stock quantity cannot be negative')).default(0),
  min_stock_level: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val);
    if (isNaN(num)) throw new Error('Invalid min stock level');
    return num;
  }).pipe(z.number().min(0, 'Min stock level cannot be negative')).default(0),
  weight: z.union([z.string(), z.number()]).transform((val) => {
    if (val === undefined || val === null) return null;
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() === '') return null;
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error('Invalid weight');
    return num;
  }).pipe(z.number().positive().nullable()).optional(),
  dimensions: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const RestockProductSchema = z.object({
  quantity: z.number().positive('Quantity must be positive'),
});

// Query parameter validation
export const ProductQuerySchema = z.object({
  page: z.preprocess((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val as string);
    return isNaN(num) ? 1 : num;
  }, z.number().default(1)),
  limit: z.preprocess((val) => {
    if (typeof val === 'number') return val;
    const num = parseInt(val as string);
    return isNaN(num) ? 10 : num;
  }, z.number().default(10)),
  category_id: z.preprocess((val) => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === 'number') return val;
    const num = parseInt(val as string);
    return isNaN(num) ? undefined : num;
  }, z.number().optional()),
  category_slug: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['name', 'price', 'created_at', 'updated_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const CategoryParamsSchema = z.object({
  category_slug: z.string(),
});

// Response schemas
export const ProductsOkSchema = BaseOkSchema.extend({
  data: z.array(ProductSchema),
});

export const ProductOkSchema = BaseOkSchema.extend({
  data: ProductSchema,
});

export const ProductListResponseSchema = BaseOkSchema.extend({
  data: z.array(ProductSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    total_pages: z.number(),
  }),
});

export const ProductStatsSchema = z.object({
  total_products: z.number(),
  low_stock: z.number(),
  out_of_stock: z.number(),
  active: z.number(),
});

export const ProductStatsResponseSchema = BaseOkSchema.extend({
  data: ProductStatsSchema,
});

// Type exports
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type RestockProductInput = z.infer<typeof RestockProductSchema>;
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
export type CategoryParamsInput = z.infer<typeof CategoryParamsSchema>;