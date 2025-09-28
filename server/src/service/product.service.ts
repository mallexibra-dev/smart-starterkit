import { db } from '../../utils/db'

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  category: string | null
  sku: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string | null
}

export interface CreateProductData {
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  sku?: string
  status?: 'active' | 'inactive'
}

export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  stock?: number
  category?: string
  sku?: string
  status?: 'active' | 'inactive'
}

export class ProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const [rows] = await db.execute(
        'SELECT id, name, description, price, stock, category, sku, status, created_at, updated_at FROM products WHERE deleted_at IS NULL ORDER BY created_at DESC'
      )
      
      return rows as Product[]
    } catch (error) {
      console.error('Error getting products:', error)
      throw new Error('Failed to retrieve products')
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      const [rows] = await db.execute(
        'SELECT id, name, description, price, stock, category, sku, status, created_at, updated_at FROM products WHERE id = ? AND deleted_at IS NULL',
        [id]
      )
      
      const products = rows as Product[]
      return products.length > 0 ? products[0] : null
    } catch (error) {
      console.error('Error getting product by id:', error)
      throw new Error('Failed to retrieve product')
    }
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const { name, description, price, stock, category, sku, status = 'active' } = data
      
      const [result] = await db.execute(
        'INSERT INTO products (name, description, price, stock, category, sku, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, price, stock, category, sku, status]
      )
      
      const insertResult = result as any
      const newProduct = await this.getProductById(insertResult.insertId)
      
      if (!newProduct) {
        throw new Error('Failed to retrieve created product')
      }
      
      return newProduct
    } catch (error) {
      console.error('Error creating product:', error)
      throw new Error('Failed to create product')
    }
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<Product | null> {
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
        return await this.getProductById(id)
      }
      
      values.push(id)
      
      await db.execute(
        `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL`,
        values
      )
      
      return await this.getProductById(id)
    } catch (error) {
      console.error('Error updating product:', error)
      throw new Error('Failed to update product')
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const [result] = await db.execute(
        'UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
        [id]
      )
      
      const updateResult = result as any
      return updateResult.affectedRows > 0
    } catch (error) {
      console.error('Error deleting product:', error)
      throw new Error('Failed to delete product')
    }
  }
}
