import { db } from '../../utils/db'
import type {
  Category,
  Product,
  CreateProductData,
  UpdateProductData,
  ProductQuery,
  ProductListResponse
} from '../../../shared/src/types/products.type'

export class ProductService {
  async getProducts(query: ProductQuery): Promise<ProductListResponse> {
    try {
      let sql = `
        SELECT
          p.id, p.name, p.description, p.price, p.category_id, p.status, p.sku,
          p.stock_quantity, p.min_stock_level, p.weight, p.dimensions,
          p.images, p.tags, p.created_at, p.updated_at,
          c.name as category_name, c.slug as category_slug, c.color as category_color,
          c.icon as category_icon
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.deleted_at IS NULL
      `

      const params: any[] = []
      const conditions: string[] = []

      // Add filters
      if (query.category_id) {
        conditions.push('p.category_id = ?')
        params.push(query.category_id)
      }

      if (query.category_slug) {
        conditions.push('c.slug = ?')
        params.push(query.category_slug)
      }

      if (query.status) {
        conditions.push('p.status = ?')
        params.push(query.status)
      }

      // Simple search implementation
      if (query.search && query.search.trim().length > 0) {
        const searchValue = query.search.trim()
        if (searchValue.length > 0) {
          conditions.push('p.name LIKE ?')
          params.push(`%${searchValue}%`)
        }
      }

      if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ')
      }

      // Add sorting
      const sortColumn = query.sort_by === 'name' ? 'p.name' :
                        query.sort_by === 'price' ? 'p.price' :
                        query.sort_by === 'updated_at' ? 'p.updated_at' : 'p.created_at'
      sql += ` ORDER BY ${sortColumn} ${(query.sort_order || 'desc').toUpperCase()}`

      // Add pagination
      const page = Number(query.page || 1)
      const limit = Number(query.limit || 10)
      const offset = (page - 1) * limit
      const offsetNum = Number(offset)

      // Use template literals for LIMIT and OFFSET to avoid parameter binding issues
      sql += ` LIMIT ${limit} OFFSET ${offsetNum}`

      const [rows] = await db.execute(sql, params)

      // Get total count for pagination
      let countSql = 'SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.deleted_at IS NULL'
      const countParams: any[] = []

      if (conditions.length > 0) {
        countSql += ' AND ' + conditions.join(' AND ')
        countParams.push(...params)
      }

      const [countRows] = await db.execute(countSql, countParams)
      const total = (countRows as any[])[0].total

      // Parse JSON fields for each product
      const products = (rows as any[]).map(row => ({
        ...row,
        images: row.images ? (typeof row.images === 'string' ? JSON.parse(row.images) : row.images) : [],
        tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : [],
        category: row.category_id ? {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          color: row.category_color,
          icon: row.category_icon,
        } : null,
      })) as Product[]

      const totalPages = Math.ceil(total / query.limit)

      return {
        data: products,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          total_pages: totalPages
        }
      }
    } catch (error) {
      console.error('Error getting products:', error)
      throw new Error('Failed to retrieve products')
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      const [rows] = await db.execute(
        `SELECT
          p.id, p.name, p.description, p.price, p.category_id, p.status, p.sku,
          p.stock_quantity, p.min_stock_level, p.weight, p.dimensions,
          p.images, p.tags, p.created_at, p.updated_at,
          c.name as category_name, c.slug as category_slug, c.color as category_color,
          c.icon as category_icon
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ? AND p.deleted_at IS NULL`,
        [id]
      )

      if ((rows as any[]).length === 0) {
        return null
      }

      const row = (rows as any[])[0]
      const product = {
        ...row,
        images: row.images ? (typeof row.images === 'string' ? JSON.parse(row.images) : row.images) : [],
        tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : [],
        category: row.category_id ? {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          color: row.category_color,
          icon: row.category_icon,
        } : null,
      } as Product

      return product
    } catch (error) {
      console.error('Error getting product by id:', error)
      throw new Error('Failed to retrieve product')
    }
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const [result] = await db.execute(
        `INSERT INTO products (
          name, description, price, category_id, status, sku,
          stock_quantity, min_stock_level, weight, dimensions,
          images, tags, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          data.name,
          data.description || null,
          data.price,
          data.category_id,
          data.status || 'draft',
          data.sku,
          data.stock_quantity || 0,
          data.min_stock_level || 0,
          data.weight || null,
          data.dimensions || null,
          data.images ? JSON.stringify(data.images) : null,
          data.tags ? JSON.stringify(data.tags) : null
        ]
      )

      const insertId = (result as any).insertId
      const product = await this.getProductById(insertId)

      if (!product) {
        throw new Error('Failed to retrieve created product')
      }

      return product
    } catch (error) {
      console.error('Error creating product:', error)
      throw new Error('Failed to create product')
    }
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<Product | null> {
    try {
      const updateFields: string[] = []
      const params: any[] = []

      // Get existing product to merge tags if needed
      let existingProduct: Product | null = null
      if (data.tags !== undefined) {
        existingProduct = await this.getProductById(id)
        if (!existingProduct) {
          return null
        }
      }

      // Build dynamic update query
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'images' || key === 'tags') {
            updateFields.push(`${key} = ?`)

            // For tags, merge with existing tags to avoid losing old ones
            if (key === 'tags' && existingProduct && existingProduct.tags) {
              const existingTags = existingProduct.tags
              const newTags = value as string[]
              // Combine and remove duplicates, then filter out empty strings
              const mergedTags = [...new Set([...existingTags, ...newTags])].filter(tag => tag.trim() !== '')
              params.push(JSON.stringify(mergedTags))
            } else {
              params.push(JSON.stringify(value))
            }
          } else {
            updateFields.push(`${key} = ?`)
            params.push(value)
          }
        }
      })

      if (updateFields.length === 0) {
        return await this.getProductById(id)
      }

      updateFields.push('updated_at = NOW()')
      params.push(id)

      await db.execute(
        `UPDATE products SET ${updateFields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
        params
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
        'UPDATE products SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
        [id]
      )

      return (result as any).affectedRows > 0
    } catch (error) {
      console.error('Error deleting product:', error)
      throw new Error('Failed to delete product')
    }
  }

  async checkUniqueSKU(sku: string, excludeId?: number): Promise<boolean> {
    try {
      let sql = 'SELECT COUNT(*) as count FROM products WHERE sku = ? AND deleted_at IS NULL'
      const params: any[] = [sku]

      if (excludeId) {
        sql += ' AND id != ?'
        params.push(excludeId)
      }

      const [rows] = await db.execute(sql, params)
      const count = (rows as any[])[0].count

      return count === 0
    } catch (error) {
      console.error('Error checking SKU uniqueness:', error)
      throw new Error('Failed to check SKU uniqueness')
    }
  }

  async getLowStockProducts(): Promise<Product[]> {
    try {
      const [rows] = await db.execute(
        `SELECT
          id, name, description, price, category_id, status, sku,
          stock_quantity, min_stock_level, weight, dimensions,
          images, tags, created_at, updated_at
        FROM products
        WHERE deleted_at IS NULL
        AND stock_quantity <= min_stock_level
        AND status = 'active'
        ORDER BY stock_quantity ASC`
      )

      return rows as Product[]
    } catch (error) {
      console.error('Error getting low stock products:', error)
      throw new Error('Failed to retrieve low stock products')
    }
  }

  async restockProduct(id: number, quantity: number): Promise<Product | null> {
    try {
      const [result] = await db.execute(
        `UPDATE products
         SET stock_quantity = stock_quantity + ?, updated_at = NOW()
         WHERE id = ? AND deleted_at IS NULL`,
        [quantity, id]
      )

      if ((result as any).affectedRows === 0) {
        return null
      }

      return await this.getProductById(id)
    } catch (error) {
      console.error('Error restocking product:', error)
      throw new Error('Failed to restock product')
    }
  }

  async getProductStats() {
    try {
      const [totalRows] = await db.execute(
        'SELECT COUNT(*) as total FROM products WHERE deleted_at IS NULL'
      )

      const [lowStockRows] = await db.execute(
        'SELECT COUNT(*) as low_stock FROM products WHERE deleted_at IS NULL AND stock_quantity <= min_stock_level AND stock_quantity > 0'
      )

      const [outOfStockRows] = await db.execute(
        'SELECT COUNT(*) as out_of_stock FROM products WHERE deleted_at IS NULL AND stock_quantity = 0'
      )

      const [activeRows] = await db.execute(
        'SELECT COUNT(*) as active FROM products WHERE deleted_at IS NULL AND status = \'active\''
      )

      return {
        total_products: (totalRows as any[])[0].total,
        low_stock: (lowStockRows as any[])[0].low_stock,
        out_of_stock: (outOfStockRows as any[])[0].out_of_stock,
        active: (activeRows as any[])[0].active,
      }
    } catch (error) {
      console.error('Error getting product stats:', error)
      throw new Error('Failed to retrieve product stats')
    }
  }

  async getCategoryStats() {
    try {
      const [rows] = await db.execute(`
        SELECT
          c.name as category,
          COUNT(*) as count,
          SUM(CASE WHEN p.stock_quantity <= p.min_stock_level AND p.stock_quantity > 0 THEN 1 ELSE 0 END) as low_stock_count,
          SUM(p.price * p.stock_quantity) as total_value,
          AVG(p.price) as avg_price
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.deleted_at IS NULL
        GROUP BY c.name
        ORDER BY count DESC
      `)

      return (rows as any[]).map(row => ({
        category: row.category || 'Uncategorized',
        count: row.count,
        lowStockCount: row.low_stock_count,
        totalValue: row.total_value || 0,
        avgPrice: row.avg_price || 0
      }))
    } catch (error) {
      console.error('Error getting category stats:', error)
      throw new Error('Failed to retrieve category stats')
    }
  }

  async activateProduct(id: number): Promise<Product | null> {
    try {
      const [result] = await db.execute(
        `UPDATE products
         SET status = 'active', updated_at = NOW()
         WHERE id = ? AND deleted_at IS NULL`,
        [id]
      )

      if ((result as any).affectedRows === 0) {
        return null
      }

      // Get the updated product
      const rows = await db.execute(`
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ? AND p.deleted_at IS NULL
      `, [id])

      if ((rows as any[]).length === 0) {
        return null
      }

      const product = (rows as any[])[0]
      return {
        ...product,
        category: product.category_name ? {
          id: product.category_id,
          name: product.category_name,
          slug: product.category_slug
        } : null
      }
    } catch (error) {
      console.error('Error activating product:', error)
      throw new Error('Failed to activate product')
    }
  }

  async deactivateProduct(id: number): Promise<Product | null> {
    try {
      const [result] = await db.execute(
        `UPDATE products
         SET status = 'inactive', updated_at = NOW()
         WHERE id = ? AND deleted_at IS NULL`,
        [id]
      )

      if ((result as any).affectedRows === 0) {
        return null
      }

      // Get the updated product
      const rows = await db.execute(`
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ? AND p.deleted_at IS NULL
      `, [id])

      if ((rows as any[]).length === 0) {
        return null
      }

      const product = (rows as any[])[0]
      return {
        ...product,
        category: product.category_name ? {
          id: product.category_id,
          name: product.category_name,
          slug: product.category_slug
        } : null
      }
    } catch (error) {
      console.error('Error deactivating product:', error)
      throw new Error('Failed to deactivate product')
    }
  }
}