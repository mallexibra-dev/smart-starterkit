import { db } from '../../utils/db'

export interface Transaction {
  id: number
  user_id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  transaction_type: 'purchase' | 'sale' | 'return'
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  payment_method: string | null
  reference_number: string | null
  notes: string | null
  created_at: string
  updated_at: string | null
}

export interface CreateTransactionData {
  user_id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  transaction_type?: 'purchase' | 'sale' | 'return'
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded'
  payment_method?: string
  reference_number?: string
  notes?: string
}

export interface UpdateTransactionData {
  user_id?: number
  product_id?: number
  quantity?: number
  unit_price?: number
  total_price?: number
  transaction_type?: 'purchase' | 'sale' | 'return'
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded'
  payment_method?: string
  reference_number?: string
  notes?: string
}

export class TransactionService {
  async getTransactions(): Promise<Transaction[]> {
    try {
      const [rows] = await db.execute(
        `SELECT t.id, t.user_id, t.product_id, t.quantity, t.unit_price, t.total_price, 
                t.transaction_type, t.status, t.payment_method, t.reference_number, t.notes, 
                t.created_at, t.updated_at
         FROM transactions t 
         WHERE t.deleted_at IS NULL 
         ORDER BY t.created_at DESC`
      )
      
      return rows as Transaction[]
    } catch (error) {
      console.error('Error getting transactions:', error)
      throw new Error('Failed to retrieve transactions')
    }
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    try {
      const [rows] = await db.execute(
        `SELECT t.id, t.user_id, t.product_id, t.quantity, t.unit_price, t.total_price, 
                t.transaction_type, t.status, t.payment_method, t.reference_number, t.notes, 
                t.created_at, t.updated_at
         FROM transactions t 
         WHERE t.id = ? AND t.deleted_at IS NULL`,
        [id]
      )
      
      const transactions = rows as Transaction[]
      return transactions.length > 0 ? transactions[0] : null
    } catch (error) {
      console.error('Error getting transaction by id:', error)
      throw new Error('Failed to retrieve transaction')
    }
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    try {
      const [rows] = await db.execute(
        `SELECT t.id, t.user_id, t.product_id, t.quantity, t.unit_price, t.total_price, 
                t.transaction_type, t.status, t.payment_method, t.reference_number, t.notes, 
                t.created_at, t.updated_at
         FROM transactions t 
         WHERE t.user_id = ? AND t.deleted_at IS NULL 
         ORDER BY t.created_at DESC`,
        [userId]
      )
      
      return rows as Transaction[]
    } catch (error) {
      console.error('Error getting transactions by user id:', error)
      throw new Error('Failed to retrieve user transactions')
    }
  }

  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    try {
      const { 
        user_id, product_id, quantity, unit_price, total_price, 
        transaction_type = 'sale', status = 'pending', 
        payment_method, reference_number, notes 
      } = data
      
      const [result] = await db.execute(
        `INSERT INTO transactions (user_id, product_id, quantity, unit_price, total_price, 
                                  transaction_type, status, payment_method, reference_number, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, product_id, quantity, unit_price, total_price, 
         transaction_type, status, payment_method, reference_number, notes]
      )
      
      const insertResult = result as any
      const newTransaction = await this.getTransactionById(insertResult.insertId)
      
      if (!newTransaction) {
        throw new Error('Failed to retrieve created transaction')
      }
      
      return newTransaction
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw new Error('Failed to create transaction')
    }
  }

  async updateTransaction(id: number, data: UpdateTransactionData): Promise<Transaction | null> {
    try {
      const fields = []
      const values = []
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          fields.push(`${key} = ?`)
          values.push(value)
        }
      })
      
      if (fields.length === 0) {
        return await this.getTransactionById(id)
      }
      
      values.push(id)
      
      await db.execute(
        `UPDATE transactions SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL`,
        values
      )
      
      return await this.getTransactionById(id)
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw new Error('Failed to update transaction')
    }
  }

  async deleteTransaction(id: number): Promise<boolean> {
    try {
      const [result] = await db.execute(
        'UPDATE transactions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
        [id]
      )
      
      const updateResult = result as any
      return updateResult.affectedRows > 0
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw new Error('Failed to delete transaction')
    }
  }
} 