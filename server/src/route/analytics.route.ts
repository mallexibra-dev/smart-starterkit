import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { AnalyticsController } from '../controller/analytics.controller'

const analyticsController = new AnalyticsController()

const app = new OpenAPIHono()

// Main analytics endpoint - returns all analytics data
const analyticsRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: { type: 'object' }
            }
          }
        }
      },
      description: 'Successfully retrieved analytics data'
    },
    500: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
            }
          }
        }
      },
      description: 'Failed to retrieve analytics data'
    }
  }
})

// Overview stats endpoint
const overviewRoute = createRoute({
  method: 'get',
  path: '/overview',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: { type: 'object' }
            }
          }
        }
      },
      description: 'Successfully retrieved overview stats'
    },
    500: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
            }
          }
        }
      },
      description: 'Failed to retrieve overview stats'
    }
  }
})

// Sales data endpoint
const salesRoute = createRoute({
  method: 'get',
  path: '/sales',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: { type: 'array' }
            }
          }
        }
      },
      description: 'Successfully retrieved sales data'
    },
    500: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
            }
          }
        }
      },
      description: 'Failed to retrieve sales data'
    }
  }
})

// Top products endpoint
const topProductsRoute = createRoute({
  method: 'get',
  path: '/top-products',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: { type: 'array' }
            }
          }
        }
      },
      description: 'Successfully retrieved top products'
    },
    500: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
            }
          }
        }
      },
      description: 'Failed to retrieve top products'
    }
  }
})

// Transaction status endpoint
const transactionStatusRoute = createRoute({
  method: 'get',
  path: '/transaction-status',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: { type: 'array' }
            }
          }
        }
      },
      description: 'Successfully retrieved transaction status'
    },
    500: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
            }
          }
        }
      },
      description: 'Failed to retrieve transaction status'
    }
  }
})

// Recent transactions endpoint
const recentTransactionsRoute = createRoute({
  method: 'get',
  path: '/recent-transactions',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: { type: 'array' }
            }
          }
        }
      },
      description: 'Successfully retrieved recent transactions'
    },
    500: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
            }
          }
        }
      },
      description: 'Failed to retrieve recent transactions'
    }
  }
})

// Register routes
app.openapi(analyticsRoute, analyticsController.getAnalyticsData.bind(analyticsController))
app.openapi(overviewRoute, analyticsController.getOverviewStats.bind(analyticsController))
app.openapi(salesRoute, analyticsController.getSalesData.bind(analyticsController))
app.openapi(topProductsRoute, analyticsController.getTopProducts.bind(analyticsController))
app.openapi(transactionStatusRoute, analyticsController.getTransactionStatus.bind(analyticsController))
app.openapi(recentTransactionsRoute, analyticsController.getRecentTransactions.bind(analyticsController))

export default app