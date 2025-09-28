import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { TransactionController } from '../controller/transaction.controller'
import { 
  TransactionsOk, 
  TransactionOk, 
  BaseOk, 
  BaseError, 
  CreateTransaction, 
  UpdateTransaction 
} from '../schemas/transaction.schema'

const router = new OpenAPIHono()
const controller = new TransactionController()

// GET /transactions
router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: { 
        description: 'List of transactions retrieved successfully', 
        content: { 'application/json': { schema: TransactionsOk } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Transactions'],
    summary: 'Get all transactions',
  }),
  (c) => controller.getTransactions(c)
)

// GET /transactions/:id
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
        description: 'Transaction retrieved successfully', 
        content: { 'application/json': { schema: TransactionOk } } 
      },
      400: { 
        description: 'Invalid transaction ID', 
        content: { 'application/json': { schema: BaseError } } 
      },
      404: { 
        description: 'Transaction not found', 
        content: { 'application/json': { schema: BaseError } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Transactions'],
    summary: 'Get transaction by ID',
  }),
  (c) => controller.getTransactionById(c)
)

// GET /transactions/user/:userId
router.openapi(
  createRoute({
    method: 'get',
    path: '/user/{userId}',
    request: {
      params: z.object({
        userId: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      200: { 
        description: 'User transactions retrieved successfully', 
        content: { 'application/json': { schema: TransactionsOk } } 
      },
      400: { 
        description: 'Invalid user ID', 
        content: { 'application/json': { schema: BaseError } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Transactions'],
    summary: 'Get transactions by user ID',
  }),
  (c) => controller.getTransactionsByUserId(c)
)

// POST /transactions
router.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateTransaction,
          },
        },
      },
    },
    responses: {
      201: { 
        description: 'Transaction created successfully', 
        content: { 'application/json': { schema: TransactionOk } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Transactions'],
    summary: 'Create new transaction',
  }),
  (c) => controller.createTransaction(c)
)

// PUT /transactions/:id
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
            schema: UpdateTransaction,
          },
        },
      },
    },
    responses: {
      200: { 
        description: 'Transaction updated successfully', 
        content: { 'application/json': { schema: TransactionOk } } 
      },
      400: { 
        description: 'Invalid transaction ID', 
        content: { 'application/json': { schema: BaseError } } 
      },
      404: { 
        description: 'Transaction not found', 
        content: { 'application/json': { schema: BaseError } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Transactions'],
    summary: 'Update transaction by ID',
  }),
  (c) => controller.updateTransaction(c)
)

// DELETE /transactions/:id
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
        description: 'Transaction deleted successfully', 
        content: { 'application/json': { schema: BaseOk } } 
      },
      400: { 
        description: 'Invalid transaction ID', 
        content: { 'application/json': { schema: BaseError } } 
      },
      404: { 
        description: 'Transaction not found', 
        content: { 'application/json': { schema: BaseError } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Transactions'],
    summary: 'Delete transaction by ID',
  }),
  (c) => controller.deleteTransaction(c)
)

export default router 