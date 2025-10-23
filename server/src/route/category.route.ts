import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { CategoryController } from '../controller/category.controller'
import {
  Category,
  CreateCategory,
  UpdateCategory,
  UpdateSortOrder,
  CategoryStats,
  CategoryStatsOk
} from '../schemas/category.schema'
import {
  CategoriesOk,
  CategoryOk
} from '../schemas/product.schema'
import { BaseOk, BaseError } from '../schemas/base.schema'


const router = new OpenAPIHono()
const controller = new CategoryController()

// GET /categories - List all active categories
router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        description: 'Categories retrieved successfully',
        content: { 'application/json': { schema: CategoriesOk } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Get all active categories',
    description: 'Retrieve all active categories ordered by sort order and name',
  }),
  (c) => controller.getCategories(c)
)

// GET /categories/all - List all categories including inactive
router.openapi(
  createRoute({
    method: 'get',
    path: '/all',
    responses: {
      200: {
        description: 'All categories retrieved successfully',
        content: { 'application/json': { schema: CategoriesOk } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Get all categories',
    description: 'Retrieve all categories including inactive ones',
  }),
  (c) => controller.getAllCategories(c)
)

// GET /categories/stats - Get category statistics
router.openapi(
  createRoute({
    method: 'get',
    path: '/stats',
    responses: {
      200: {
        description: 'Category statistics retrieved successfully',
        content: { 'application/json': { schema: CategoryStatsOk } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Get category statistics',
    description: 'Retrieve statistics for all categories including product counts',
  }),
  (c) => controller.getCategoryStats(c)
)

// GET /categories/{id} - Get category by ID
router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.number().openapi({ example: 1 })
      })
    },
    responses: {
      200: {
        description: 'Category retrieved successfully',
        content: { 'application/json': { schema: CategoryOk } }
      },
      404: {
        description: 'Category not found',
        content: { 'application/json': { schema: BaseError } }
      },
      400: {
        description: 'Invalid category ID',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Get category by ID',
    description: 'Retrieve a specific category by its ID',
  }),
  (c) => controller.getCategoryById(c)
)

// GET /categories/slug/{slug} - Get category by slug
router.openapi(
  createRoute({
    method: 'get',
    path: '/slug/{slug}',
    request: {
      params: z.object({
        slug: z.string().openapi({ example: 'electronics' })
      })
    },
    responses: {
      200: {
        description: 'Category retrieved successfully',
        content: { 'application/json': { schema: CategoryOk } }
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
    summary: 'Get category by slug',
    description: 'Retrieve a specific category by its slug',
  }),
  (c) => controller.getCategoryBySlug(c)
)

// POST /categories - Create new category
router.openapi(
  createRoute({
    method: 'post',
    path: '/',
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
        description: 'Validation error',
        content: { 'application/json': { schema: BaseError } }
      },
      409: {
        description: 'Conflict - slug already exists',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Create new category',
    description: 'Create a new category with the provided details',
  }),
  (c) => controller.createCategory(c)
)

// PUT /categories/{id} - Update category
router.openapi(
  createRoute({
    method: 'put',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.number().openapi({ example: 1 })
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
        description: 'Validation error or invalid category ID',
        content: { 'application/json': { schema: BaseError } }
      },
      404: {
        description: 'Category not found',
        content: { 'application/json': { schema: BaseError } }
      },
      409: {
        description: 'Conflict - slug already exists',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Update category',
    description: 'Update an existing category with new details',
  }),
  (c) => controller.updateCategory(c)
)

// PUT /categories/sort-order - Update categories sort order
router.openapi(
  createRoute({
    method: 'put',
    path: '/sort-order',
    request: {
      body: {
        content: {
          'application/json': {
            schema: UpdateSortOrder,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sort order updated successfully',
        content: { 'application/json': { schema: BaseOk } }
      },
      400: {
        description: 'Validation error',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Categories'],
    summary: 'Update categories sort order',
    description: 'Update sort order of multiple categories',
  }),
  (c) => controller.updateSortOrder(c)
)

// DELETE /categories/{id} - Delete category
router.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.number().openapi({ example: 1 })
      })
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
    summary: 'Delete category',
    description: 'Delete a category (sets status to inactive if no products)',
  }),
  (c) => controller.deleteCategory(c)
)

export default router