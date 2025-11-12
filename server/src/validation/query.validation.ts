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

// Common validation schemas
export const CommonQueryParams = {
  page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val) : undefined).openapi({
    example: '1',
    description: 'Page number for pagination'
  }),
  limit: z.string().regex(/^\d+$/).optional().transform(val => val ? Math.max(1, Math.min(100, parseInt(val))) : undefined).openapi({
    example: '10',
    description: 'Number of items per page (max 100)'
  }),
  search: z.string().optional().openapi({
    example: 'search term',
    description: 'Search term'
  }),
  sortBy: z.enum(['id', 'name', 'status', 'created_at', 'updated_at']).optional().openapi({
    example: 'name',
    description: 'Sort by column'
  }),
  sortOrder: z.enum(['asc', 'desc']).optional().openapi({
    example: 'asc',
    description: 'Sort order'
  }),
} as const;