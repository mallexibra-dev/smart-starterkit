import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ProductController } from '../controller/product.controller'
import { 
  ProductsOk, 
  ProductOk, 
  BaseOk, 
  BaseError, 
  CreateProduct, 
  UpdateProduct 
} from '../schemas/product.schema'

const router = new OpenAPIHono()
const controller = new ProductController()

// GET /products
router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: { 
        description: 'List of products retrieved successfully', 
        content: { 'application/json': { schema: ProductsOk } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Products'],
    summary: 'Get all products',
  }),
  (c) => controller.getProducts(c)
)

// GET /products/:id
router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      200: { 
        description: 'Product retrieved successfully', 
        content: { 'application/json': { schema: ProductOk } } 
      },
      404: { 
        description: 'Product not found', 
        content: { 'application/json': { schema: BaseError } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Products'],
    summary: 'Get product by ID',
  }),
  (c) => controller.getProductById(c)
)

// POST /products
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
        content: { 'application/json': { schema: ProductOk } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Products'],
    summary: 'Create new product',
  }),
  (c) => controller.createProduct(c)
)

// PUT /products/:id
router.openapi(
  createRoute({
    method: 'put',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
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
        content: { 'application/json': { schema: ProductOk } } 
      },
      404: { 
        description: 'Product not found', 
        content: { 'application/json': { schema: BaseError } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Products'],
    summary: 'Update product by ID',
  }),
  (c) => controller.updateProduct(c)
)

// DELETE /products/:id
router.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      200: { 
        description: 'Product deleted successfully', 
        content: { 'application/json': { schema: BaseOk } } 
      },
      404: { 
        description: 'Product not found', 
        content: { 'application/json': { schema: BaseError } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Products'],
    summary: 'Delete product by ID',
  }),
  (c) => controller.deleteProduct(c)
)

export default router
