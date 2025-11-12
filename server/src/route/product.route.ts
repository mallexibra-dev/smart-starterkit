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
import { validateQueryParams } from '../validation/query-product.validation'
import { ProductQueryParams } from '../validation/query-product.validation'

const router = new OpenAPIHono()
const controller = new ProductController()

// GET /products with query parameter validation
router.use(
  '/products',
  validateQueryParams({
    schema: ProductQueryParams,
    errorMessage: 'Invalid query parameters for products'
  })
)

// GET /products
router.openapi(
  createRoute({
    method: 'get',
    path: '/products',
    parameters: Object.entries(ProductQueryParams.shape).map(([key, schema]) => ({
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
        description: 'List of products retrieved successfully',
        content: {
          'application/json': {
            schema: ProductsOk
          }
        }
      },
      400: {
        description: 'Invalid query parameters',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
      500: {
        description: 'Server Error',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
    },
    tags: ['Products'],
    summary: 'Get all products with filtering and pagination',
  }),
  (c) => {
    return controller.getProducts(c);
  }
)

// GET /products/:id
router.openapi(
  createRoute({
    method: 'get',
    path: '/products/{id}',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      200: {
        description: 'Product retrieved successfully',
        content: {
          'application/json': {
            schema: ProductOk
          }
        }
      },
      400: {
        description: 'Invalid product ID',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
      404: {
        description: 'Product not found',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
      500: {
        description: 'Server Error',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
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
    path: '/products',
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
        content: {
          'application/json': {
            schema: ProductOk
          }
        }
      },
      400: {
        description: 'Invalid request body',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
      500: {
        description: 'Server Error',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
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
    path: '/products/{id}',
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
        content: {
          'application/json': {
            schema: ProductOk
          }
        }
      },
      400: {
        description: 'Invalid request body or product ID',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
      404: {
        description: 'Product not found',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
      500: {
        description: 'Server Error',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
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
    path: '/products/{id}',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      200: {
        description: 'Product deleted successfully',
        content: {
          'application/json': {
            schema: BaseOk
          }
        }
      },
      400: {
        description: 'Invalid product ID',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
      404: {
        description: 'Product not found',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
      500: {
        description: 'Server Error',
        content: {
          'application/json': {
            schema: BaseError
          }
        }
      },
    },
    tags: ['Products'],
    summary: 'Delete product by ID',
  }),
  (c) => controller.deleteProduct(c)
)

export default router