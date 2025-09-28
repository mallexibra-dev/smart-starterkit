import type { Context } from 'hono'
import { TransactionService, type CreateTransactionData, type UpdateTransactionData } from '../service/transaction.service'

export class TransactionController {
  private transactionService: TransactionService

  constructor() {
    this.transactionService = new TransactionService()
  }

  async getTransactions(c: Context) {
    try {
      const transactions = await this.transactionService.getTransactions()
      
      return c.json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: transactions,
      }, 200)
    } catch (error) {
      console.error('Error getting transactions:', error)
      
      return c.json({
        success: false,
        message: 'Failed to retrieve transactions',
      }, 500)
    }
  }

  async getTransactionById(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      
      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid transaction ID',
        }, 400)
      }

      const transaction = await this.transactionService.getTransactionById(id)
      
      if (!transaction) {
        return c.json({
          success: false,
          message: 'Transaction not found',
        }, 404)
      }
      
      return c.json({
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      }, 200)
    } catch (error) {
      console.error('Error getting transaction by id:', error)
      
      return c.json({
        success: false,
        message: 'Failed to retrieve transaction',
      }, 500)
    }
  }

  async getTransactionsByUserId(c: Context) {
    try {
      const userId = parseInt(c.req.param('userId'))
      
      if (isNaN(userId)) {
        return c.json({
          success: false,
          message: 'Invalid user ID',
        }, 400)
      }

      const transactions = await this.transactionService.getTransactionsByUserId(userId)
      
      return c.json({
        success: true,
        message: 'User transactions retrieved successfully',
        data: transactions,
      }, 200)
    } catch (error) {
      console.error('Error getting transactions by user id:', error)
      
      return c.json({
        success: false,
        message: 'Failed to retrieve user transactions',
      }, 500)
    }
  }

  async createTransaction(c: Context) {
    try {
      const body = await c.req.json() as CreateTransactionData
      
      const transaction = await this.transactionService.createTransaction(body)
      
      return c.json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
      }, 201)
    } catch (error) {
      console.error('Error creating transaction:', error)
      
      return c.json({
        success: false,
        message: 'Failed to create transaction',
      }, 500)
    }
  }

  async updateTransaction(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      
      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid transaction ID',
        }, 400)
      }

      const body = await c.req.json() as UpdateTransactionData
      
      const transaction = await this.transactionService.updateTransaction(id, body)
      
      if (!transaction) {
        return c.json({
          success: false,
          message: 'Transaction not found',
        }, 404)
      }
      
      return c.json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction,
      }, 200)
    } catch (error) {
      console.error('Error updating transaction:', error)
      
      return c.json({
        success: false,
        message: 'Failed to update transaction',
      }, 500)
    }
  }

  async deleteTransaction(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      
      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid transaction ID',
        }, 400)
      }

      const deleted = await this.transactionService.deleteTransaction(id)
      
      if (!deleted) {
        return c.json({
          success: false,
          message: 'Transaction not found',
        }, 404)
      }
      
      return c.json({
        success: true,
        message: 'Transaction deleted successfully',
      }, 200)
    } catch (error) {
      console.error('Error deleting transaction:', error)
      
      return c.json({
        success: false,
        message: 'Failed to delete transaction',
      }, 500)
    }
  }
} 