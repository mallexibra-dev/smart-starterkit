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

export interface ProductFilters {
  search?: string
  category?: string
  status?: 'active' | 'inactive'
  minPrice?: number
  maxPrice?: number
  minStock?: number
  maxStock?: number
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedProducts {
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class ProductService {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      let query = 'SELECT id, name, description, price, stock, category, sku, status, created_at, updated_at FROM products WHERE deleted_at IS NULL'
      const values: any[] = []

      if (filters) {
        const conditions: string[] = []

        if (filters.search) {
          conditions.push('(name LIKE ? OR description LIKE ? OR sku LIKE ?)')
          const searchTerm = `%${filters.search}%`
          values.push(searchTerm, searchTerm, searchTerm)
        }

        if (filters.category) {
          conditions.push('category = ?')
          values.push(filters.category)
        }

        if (filters.status) {
          conditions.push('status = ?')
          values.push(filters.status)
        }

        if (filters.minPrice !== undefined) {
          conditions.push('price >= ?')
          values.push(filters.minPrice)
        }

        if (filters.maxPrice !== undefined) {
          conditions.push('price <= ?')
          values.push(filters.maxPrice)
        }

        if (filters.minStock !== undefined) {
          conditions.push('stock >= ?')
          values.push(filters.minStock)
        }

        if (filters.maxStock !== undefined) {
          conditions.push('stock <= ?')
          values.push(filters.maxStock)
        }

        if (conditions.length > 0) {
          query += ' AND ' + conditions.join(' AND ')
        }
      }

      query += ' ORDER BY created_at DESC'

      const [rows] = await db.execute(query, values)

      return rows as Product[]
    } catch (error) {
      console.error('Error getting products:', error)
      throw new Error('Failed to retrieve products')
    }
  }

  async getPaginatedProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
    try {
      const page = Math.max(1, filters?.page || 1)
      const limit = Math.max(1, Math.min(100, filters?.limit || 10))
      const offset = (page - 1) * limit

      // Build WHERE conditions
      let whereClause = 'WHERE deleted_at IS NULL'
      const values: any[] = []

      if (filters) {
        const conditions: string[] = []

        if (filters.search) {
          conditions.push('(name LIKE ? OR description LIKE ? OR sku LIKE ?)')
          const searchTerm = `%${filters.search}%`
          values.push(searchTerm, searchTerm, searchTerm)
        }

        if (filters.category) {
          conditions.push('category = ?')
          values.push(filters.category)
        }

        if (filters.status) {
          conditions.push('status = ?')
          values.push(filters.status)
        }

        if (filters.minPrice !== undefined) {
          conditions.push('price >= ?')
          values.push(filters.minPrice)
        }

        if (filters.maxPrice !== undefined) {
          conditions.push('price <= ?')
          values.push(filters.maxPrice)
        }

        if (filters.minStock !== undefined) {
          conditions.push('stock >= ?')
          values.push(filters.minStock)
        }

        if (filters.maxStock !== undefined) {
          conditions.push('stock <= ?')
          values.push(filters.maxStock)
        }

        if (conditions.length > 0) {
          whereClause += ' AND ' + conditions.join(' AND ')
        }
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`
      const [countRows] = await db.execute(countQuery, values)
      const total = (countRows as any[])[0].total

      // Build ORDER BY clause
      let orderByClause = 'ORDER BY created_at DESC'
      if (filters.sortBy) {
        const validSortColumns = ['id', 'name', 'price', 'stock', 'status', 'created_at', 'updated_at', 'category', 'sku']
        const validSortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC'

        if (validSortColumns.includes(filters.sortBy)) {
          orderByClause = `ORDER BY ${filters.sortBy} ${validSortOrder}`
        }
      }

      // Get paginated data
      const dataQuery = `SELECT id, name, description, price, stock, category, sku, status, created_at, updated_at FROM products ${whereClause} ${orderByClause} LIMIT ${limit} OFFSET ${offset}`
      const [rows] = await db.execute(dataQuery, values)

      const totalPages = Math.ceil(total / limit)
      const data = rows as Product[]

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      console.error('Error getting paginated products:', error)
      throw new Error('Failed to retrieve paginated products')
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      const [rows] = await db.execute(
        'SELECT id, name, description, price, stock, category, sku, status, created_at, updated_at FROM products WHERE id = ? AND deleted_at IS NULL',
        [id]
      )

      const products = rows as Product[]
      const result = products.length > 0 ? products[0] : null
      return result as Product | null
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
    } catch (error: any) {
      console.error('Error creating product:', error)

      // Handle specific database errors
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message?.includes('sku')) {
          throw new Error('Product with this SKU already exists')
        }
        throw new Error('Product already exists')
      }

      throw new Error('Failed to create product')
    }
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<Product | null> {
    try {
      const fields: string[] = []
      const values: any[] = []

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
