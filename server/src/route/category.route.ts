import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { CategoryController } from '../controller/category.controller'
import {
  CategoriesOk,
  CategoryOk,
  BaseOk,
  BaseError,
  CreateCategory,
  UpdateCategory
} from '../schemas/category.schema'
import { validateQueryParams, CategoryQueryParams } from '../validation/query-category.validation'

const router = new OpenAPIHono()
const controller = new CategoryController()

// GET /categories with query parameter validation
router.use(
  '/categories',
  validateQueryParams({
    schema: CategoryQueryParams,
    errorMessage: 'Invalid query parameters for categories'
  })
)

// GET /categories/active - Get active categories (for dropdowns/selects)
router.openapi(
  createRoute({
    method: 'get',
    path: '/categories/active',
    responses: {
      200: {
        description: 'Active categories retrieved successfully',
        content: { 'application/json': { schema: CategoriesOk } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Get all active categories',
  }),
  (c) => controller.getActiveCategories(c)
)

// GET /categories
router.openapi(
  createRoute({
    method: 'get',
    path: '/categories',
    parameters: Object.entries(CategoryQueryParams.shape).map(([key, schema]) => ({
      name: key,
      in: 'query' as const,
      required: false,
      schema: {
        type: 'string',
        description: (schema as any)._def.description || `Filter by ${key}`
      }
    })),
    responses: {
      200: {
        description: 'List of categories retrieved successfully',
        content: { 'application/json': { schema: CategoriesOk } }
      },
      400: {
        description: 'Invalid query parameters',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Get all categories with filtering and pagination',
  }),
  (c) => {
    return controller.getCategories(c);
  }
)

// GET /categories/:id
router.openapi(
  createRoute({
    method: 'get',
    path: '/categories/{id}',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      200: {
        description: 'Category retrieved successfully',
        content: { 'application/json': { schema: CategoryOk } }
      },
      400: {
        description: 'Invalid category ID',
        content: { 'application/json': { schema: BaseError } }
      },
      404: {
        description: 'Category not found',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Get category by ID',
  }),
  (c) => controller.getCategoryById(c)
)

// POST /categories
router.openapi(
  createRoute({
    method: 'post',
    path: '/categories',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateCategory,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Category created successfully',
        content: { 'application/json': { schema: CategoryOk } }
      },
      400: {
        description: 'Invalid request body',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Create new category',
  }),
  (c) => controller.createCategory(c)
)

// PUT /categories/:id
router.openapi(
  createRoute({
    method: 'put',
    path: '/categories/{id}',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateCategory,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Category updated successfully',
        content: { 'application/json': { schema: CategoryOk } }
      },
      400: {
        description: 'Invalid request body or category ID',
        content: { 'application/json': { schema: BaseError } }
      },
      404: {
        description: 'Category not found',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Update category by ID',
  }),
  (c) => controller.updateCategory(c)
)

// DELETE /categories/:id
router.openapi(
  createRoute({
    method: 'delete',
    path: '/categories/{id}',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      200: {
        description: 'Category deleted successfully',
        content: { 'application/json': { schema: BaseOk } }
      },
      400: {
        description: 'Invalid category ID or category has products',
        content: { 'application/json': { schema: BaseError } }
      },
      404: {
        description: 'Category not found',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Delete category by ID',
  }),
  (c) => controller.deleteCategory(c)
)

export default router