import { z } from '@hono/zod-openapi'

export const Transaction = z.object({
  id: z.number().openapi({ example: 1 }),
  user_id: z.number().openapi({ example: 1 }),
  product_id: z.number().openapi({ example: 1 }),
  quantity: z.number().openapi({ example: 1 }),
  unit_price: z.number().openapi({ example: 15000000.00 }),
  total_price: z.number().openapi({ example: 15000000.00 }),
  transaction_type: z.enum(['purchase', 'sale', 'return']).openapi({ example: 'sale' }),
  status: z.enum(['pending', 'completed', 'cancelled', 'refunded']).openapi({ example: 'completed' }),
  payment_method: z.string().nullable().openapi({ example: 'credit_card' }),
  reference_number: z.string().nullable().openapi({ example: 'TXN-001-2024' }),
  notes: z.string().nullable().openapi({ example: 'First laptop purchase' }),
  created_at: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updated_at: z.string().nullable().openapi({ example: '2024-01-01T00:00:00.000Z' }),
}).openapi('Transaction')

export const CreateTransaction = z.object({
  user_id: z.number().positive().openapi({ example: 1 }),
  product_id: z.number().positive().openapi({ example: 1 }),
  quantity: z.number().positive().default(1).openapi({ example: 1 }),
  unit_price: z.number().positive().openapi({ example: 15000000.00 }),
  total_price: z.number().positive().openapi({ example: 15000000.00 }),
  transaction_type: z.enum(['purchase', 'sale', 'return']).default('sale').openapi({ example: 'sale' }),
  status: z.enum(['pending', 'completed', 'cancelled', 'refunded']).default('pending').openapi({ example: 'pending' }),
  payment_method: z.string().optional().openapi({ example: 'credit_card' }),
  reference_number: z.string().optional().openapi({ example: 'TXN-001-2024' }),
  notes: z.string().optional().openapi({ example: 'First laptop purchase' }),
}).openapi('CreateTransaction')

export const UpdateTransaction = z.object({
  user_id: z.number().positive().optional().openapi({ example: 1 }),
  product_id: z.number().positive().optional().openapi({ example: 1 }),
  quantity: z.number().positive().optional().openapi({ example: 1 }),
  unit_price: z.number().positive().optional().openapi({ example: 15000000.00 }),
  total_price: z.number().positive().optional().openapi({ example: 15000000.00 }),
  transaction_type: z.enum(['purchase', 'sale', 'return']).optional().openapi({ example: 'sale' }),
  status: z.enum(['pending', 'completed', 'cancelled', 'refunded']).optional().openapi({ example: 'completed' }),
  payment_method: z.string().optional().openapi({ example: 'credit_card' }),
  reference_number: z.string().optional().openapi({ example: 'TXN-001-2024' }),
  notes: z.string().optional().openapi({ example: 'First laptop purchase' }),
}).openapi('UpdateTransaction')

export const Base = z.object({
  success: z.boolean(),
  message: z.string().openapi({ example: 'OK' }),
}).openapi('Base')

export const BaseOk = Base
export const BaseError = Base

export const TransactionsOk = BaseOk.extend({ 
  data: z.array(Transaction) 
}).openapi('TransactionsOk')

export const TransactionOk = BaseOk.extend({ 
  data: Transaction 
}).openapi('TransactionOk') 