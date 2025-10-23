import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { ProductController } from '../controller/product.controller'
import {
  ProductListResponse,
  ProductOk,
  ProductCreated,
  ProductUpdated,
  ProductDeleted,
  ProductActivated,
  ProductDeactivated,
  ProductQuery,
  CategoryParams,
  ProductStatsResponse,
  CreateProduct,
  UpdateProduct,
  RestockProduct
} from '../schemas/product.schema'
import { BaseError } from '../schemas/base.schema'

const router = new OpenAPIHono()
const controller = new ProductController()

// GET /products - List all products with pagination, filtering, and sorting
router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: {
      query: ProductQuery,
    },
    responses: {
      200: {
        description: 'List of products retrieved successfully',
        content: { 'application/json': { schema: ProductListResponse } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Get all products',
    description: 'Retrieve a paginated list of products with optional filtering and sorting',
  }),
  (c) => controller.getProducts(c)
)

// GET /products/low-stock - Get products with low stock
router.openapi(
  createRoute({
    method: 'get',
    path: '/low-stock',
    responses: {
      200: {
        description: 'Low stock products retrieved successfully',
        content: { 'application/json': { schema: ProductListResponse } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Get low stock products',
    description: 'Retrieve products that are below their minimum stock level',
  }),
  (c) => controller.getLowStockProducts(c)
)

// GET /products/stats - Get product statistics
router.openapi(
  createRoute({
    method: 'get',
    path: '/stats',
    responses: {
      200: {
        description: 'Product stats retrieved successfully',
        content: { 'application/json': { schema: ProductStatsResponse } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Get product statistics',
    description: 'Retrieve product statistics for inventory overview',
  }),
  (c) => controller.getProductStats(c)
)

// GET /products/categories/stats - Get category statistics
router.openapi(
  createRoute({
    method: 'get',
    path: '/categories/stats',
    responses: {
      200: {
        description: 'Category stats retrieved successfully',
        content: { 'application/json': { schema: ProductStatsResponse } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Get category statistics',
    description: 'Retrieve category statistics with product counts and values',
  }),
  (c) => controller.getCategoryStats(c)
)

// GET /products/category/{category} - Get products by category
router.openapi(
  createRoute({
    method: 'get',
    path: '/category/{category}',
    request: {
      params: CategoryParams,
      query: ProductQuery.omit({ category: true }),
    },
    responses: {
      200: {
        description: 'Products by category retrieved successfully',
        content: { 'application/json': { schema: ProductListResponse } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Get products by category',
    description: 'Retrieve products filtered by category',
  }),
  (c) => controller.getProductsByCategory(c)
)

// GET /products/{id} - Get product by ID
router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    responses: {
      200: {
        description: 'Product retrieved successfully',
        content: { 'application/json': { schema: ProductOk } }
      },
      404: {
        description: 'Product not found',
        content: { 'application/json': { schema: BaseError } }
      },
      400: {
        description: 'Invalid product ID',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Get product by ID',
    description: 'Retrieve a single product by its ID',
  }),
  (c) => controller.getProductById(c)
)

// POST /products - Create new product
router.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateProduct,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Product created successfully',
        content: { 'application/json': { schema: ProductCreated } }
      },
      400: {
        description: 'Validation error or SKU already exists',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Create new product',
    description: 'Create a new product with the provided details',
  }),
  (c) => controller.createProduct(c)
)

// PUT /products/{id} - Update product
router.openapi(
  createRoute({
    method: 'put',
    path: '/{id}',
    request: {
      body: {
        content: {
          'application/json': {
            schema: UpdateProduct,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Product updated successfully',
        content: { 'application/json': { schema: ProductUpdated } }
      },
      404: {
        description: 'Product not found',
        content: { 'application/json': { schema: BaseError } }
      },
      400: {
        description: 'Validation error, invalid product ID, or SKU already exists',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Update product',
    description: 'Update an existing product by its ID',
  }),
  (c) => controller.updateProduct(c)
)

// POST /products/{id}/restock - Restock product
router.openapi(
  createRoute({
    method: 'post',
    path: '/{id}/restock',
    request: {
      body: {
        content: {
          'application/json': {
            schema: RestockProduct,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Product restocked successfully',
        content: { 'application/json': { schema: ProductUpdated } }
      },
      404: {
        description: 'Product not found',
        content: { 'application/json': { schema: BaseError } }
      },
      400: {
        description: 'Invalid product ID or quantity',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Restock product',
    description: 'Add quantity to existing product stock',
  }),
  (c) => controller.restockProduct(c)
)

// PUT /products/{id}/activate - Activate product
router.openapi(
  createRoute({
    method: 'put',
    path: '/{id}/activate',
    responses: {
      200: {
        description: 'Product activated successfully',
        content: { 'application/json': { schema: ProductActivated } }
      },
      404: {
        description: 'Product not found',
        content: { 'application/json': { schema: BaseError } }
      },
      400: {
        description: 'Invalid product ID',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Activate product',
    description: 'Activate a product by setting its status to active',
  }),
  (c) => controller.activateProduct(c)
)

// PUT /products/{id}/deactivate - Deactivate product
router.openapi(
  createRoute({
    method: 'put',
    path: '/{id}/deactivate',
    responses: {
      200: {
        description: 'Product deactivated successfully',
        content: { 'application/json': { schema: ProductDeactivated } }
      },
      404: {
        description: 'Product not found',
        content: { 'application/json': { schema: BaseError } }
      },
      400: {
        description: 'Invalid product ID',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Deactivate product',
    description: 'Deactivate a product by setting its status to inactive',
  }),
  (c) => controller.deactivateProduct(c)
)

// DELETE /products/{id} - Delete product (soft delete)
router.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    responses: {
      200: {
        description: 'Product deleted successfully',
        content: { 'application/json': { schema: ProductDeleted } }
      },
      404: {
        description: 'Product not found',
        content: { 'application/json': { schema: BaseError } }
      },
      400: {
        description: 'Invalid product ID',
        content: { 'application/json': { schema: BaseError } }
      },
      500: {
        description: 'Server Error',
        content: { 'application/json': { schema: BaseError } }
      },
    },
    tags: ['Products'],
    summary: 'Delete product',
    description: 'Soft delete a product by its ID (marks as deleted but keeps in database)',
  }),
  (c) => controller.deleteProduct(c)
)

export default router