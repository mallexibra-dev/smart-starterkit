import type { Context } from 'hono';
import type { MiddlewareHandler } from 'hono';
import { z } from '@hono/zod-openapi';
import { ResponseHelper } from '../utils/response.helper';

export interface QueryValidationOptions {
  schema: z.ZodObject<any>;
  errorMessage?: string;
}

export function validateQueryParams(options: QueryValidationOptions): MiddlewareHandler {
  const { schema, errorMessage = 'Invalid query parameters' } = options;

  return async (c: Context, next: () => Promise<void>) => {
    const queryParams = c.req.query();

    try {
      // Validate query parameters
      const validatedParams = schema.parse(queryParams);

      // Attach validated params to context for controller to use
      (c as any).set('validatedQueryParams', validatedParams);

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ResponseHelper.validationError(c, errorMessage, error.issues.map((err: any) => ({
          field: err.path?.join('.') || '',
          message: err.message,
          code: err.code as string,
          expected: err.expected,
        })));
      }

      return ResponseHelper.badRequest(c, errorMessage);
    }
  };
}

// Product-specific query validation schemas
export const ProductQueryParams = z.object({
  search: z.string().optional().openapi({
    example: 'laptop',
    description: 'Search in name, description, or SKU'
  }),
  categoryId: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val) : undefined).openapi({
    example: '1',
    description: 'Filter by category ID'
  }),
  status: z.enum(['active', 'inactive']).optional().openapi({
    example: 'active',
    description: 'Filter by product status'
  }),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).optional().transform(val => val ? parseFloat(val) : undefined).openapi({
    example: '1000000',
    description: 'Filter by minimum price'
  }),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).optional().transform(val => val ? parseFloat(val) : undefined).openapi({
    example: '20000000',
    description: 'Filter by maximum price'
  }),
  minStock: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val) : undefined).openapi({
    example: '5',
    description: 'Filter by minimum stock'
  }),
  maxStock: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val) : undefined).openapi({
    example: '100',
    description: 'Filter by maximum stock'
  }),
  page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val) : undefined).openapi({
    example: '1',
    description: 'Page number for pagination'
  }),
  limit: z.string().regex(/^\d+$/).optional().transform(val => val ? Math.max(1, Math.min(100, parseInt(val))) : undefined).openapi({
    example: '10',
    description: 'Number of items per page (max 100)'
  }),
  sortBy: z.enum(['id', 'name', 'price', 'stock', 'status', 'created_at', 'updated_at', 'categoryId', 'sku']).optional().openapi({
    example: 'name',
    description: 'Sort by column'
  }),
  sortOrder: z.enum(['asc', 'desc']).optional().openapi({
    example: 'asc',
    description: 'Sort order'
  }),
}).openapi('ProductQueryParams');