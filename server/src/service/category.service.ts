import { db } from '../../utils/db'
import type { Category, CreateCategoryData, UpdateCategoryData } from 'shared/src/types/category.type'
import { CategoryStatus } from '../../../shared/src/constants/product.constants'

export class CategoryService {
  async getCategories(): Promise<Category[]> {
    try {
      const [rows] = await db.execute(
        `SELECT
          id, name, slug, description, icon, color, sort_order, status,
          created_at, updated_at
        FROM categories
        WHERE status = ?
        ORDER BY sort_order ASC, name ASC`,
        [CategoryStatus.ACTIVE]
      )

      return rows as Category[]
    } catch (error) {
      console.error('Error getting categories:', error)
      throw new Error('Failed to retrieve categories')
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const [rows] = await db.execute(
        `SELECT
          id, name, slug, description, icon, color, sort_order, status,
          created_at, updated_at
        FROM categories
        ORDER BY sort_order ASC, name ASC`
      )

      return rows as Category[]
    } catch (error) {
      console.error('Error getting all categories:', error)
      throw new Error('Failed to retrieve categories')
    }
  }

  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const [rows] = await db.execute(
        `SELECT
          id, name, slug, description, icon, color, sort_order, status,
          created_at, updated_at
        FROM categories
        WHERE id = ?`,
        [id]
      )

      return (rows as Category[])[0] ?? null
    } catch (error) {
      console.error('Error getting category by id:', error)
      throw new Error('Failed to retrieve category')
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const [rows] = await db.execute(
        `SELECT
          id, name, slug, description, icon, color, sort_order, status,
          created_at, updated_at
        FROM categories
        WHERE slug = ?`,
        [slug]
      )

      return (rows as Category[])[0] ?? null
    } catch (error) {
      console.error('Error getting category by slug:', error)
      throw new Error('Failed to retrieve category')
    }
  }

  async createCategory(data: CreateCategoryData): Promise<Category> {
    try {
      const [result] = await db.execute(
        `INSERT INTO categories (
          name, slug, description, icon, color, sort_order, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          data.name,
          data.slug,
          data.description || null,
          data.icon || null,
          data.color || null,
          data.sort_order || 0,
          data.status || 'active'
        ]
      )

      const insertId = (result as any).insertId
      const category = await this.getCategoryById(insertId)

      if (!category) {
        throw new Error('Failed to retrieve created category')
      }

      return category
    } catch (error) {
      console.error('Error creating category:', error)
      throw new Error('Failed to create category')
    }
  }

  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category | null> {
    try {
      const updateFields: string[] = []
      const params: any[] = []

      // Build dynamic update query
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`)
          params.push(value)
        }
      })

      if (updateFields.length === 0) {
        return await this.getCategoryById(id)
      }

      updateFields.push('updated_at = NOW()')
      params.push(id)

      await db.execute(
        `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      )

      return await this.getCategoryById(id)
    } catch (error) {
      console.error('Error updating category:', error)
      throw new Error('Failed to update category')
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      // Check if category has products
      const [productRows] = await db.execute(
        'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND deleted_at IS NULL',
        [id]
      )
      const productCount = (productRows as any[])[0].count

      if (productCount > 0) {
        throw new Error('Cannot delete category with existing products')
      }

      const [result] = await db.execute(
        'UPDATE categories SET status = ?, updated_at = NOW() WHERE id = ?',
        ['inactive', id]
      )

      return (result as any).affectedRows > 0
    } catch (error) {
      console.error('Error deleting category:', error)
      throw new Error('Failed to delete category')
    }
  }

  async checkUniqueSlug(slug: string, excludeId?: number): Promise<boolean> {
    try {
      let sql = 'SELECT COUNT(*) as count FROM categories WHERE slug = ?'
      const params: any[] = [slug]

      if (excludeId) {
        sql += ' AND id != ?'
        params.push(excludeId)
      }

      const [rows] = await db.execute(sql, params)
      const count = (rows as any[])[0].count

      return count === 0
    } catch (error) {
      console.error('Error checking slug uniqueness:', error)
      throw new Error('Failed to check slug uniqueness')
    }
  }

  async updateSortOrder(categoryUpdates: { id: number; sort_order: number }[]): Promise<boolean> {
    try {
      const updatePromises = categoryUpdates.map(({ id, sort_order }) =>
        db.execute(
          'UPDATE categories SET sort_order = ?, updated_at = NOW() WHERE id = ?',
          [sort_order, id]
        )
      )

      await Promise.all(updatePromises)
      return true
    } catch (error) {
      console.error('Error updating sort order:', error)
      throw new Error('Failed to update sort order')
    }
  }

  async getCategoryStats() {
    try {
      const [rows] = await db.execute(`
        SELECT
          c.id,
          c.name,
          c.slug,
          c.color,
          COALESCE(COUNT(p.id), 0) as product_count,
          COALESCE(SUM(CASE WHEN p.stock_quantity <= p.min_stock_level AND p.stock_quantity > 0 THEN 1 ELSE 0 END), 0) as low_stock_count,
          COALESCE(SUM(CASE WHEN p.stock_quantity = 0 THEN 1 ELSE 0 END), 0) as out_of_stock_count,
          COALESCE(SUM(p.price * p.stock_quantity), 0) as total_value
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.deleted_at IS NULL
        WHERE c.status = ?
        GROUP BY c.id, c.name, c.slug, c.color
        ORDER BY c.sort_order ASC, c.name ASC
      `, [CategoryStatus.ACTIVE])

      // Convert string values to numbers for proper JSON serialization
      return (rows as any[]).map(row => ({
        ...row,
        product_count: Number(row.product_count),
        low_stock_count: Number(row.low_stock_count),
        out_of_stock_count: Number(row.out_of_stock_count),
        total_value: Number(row.total_value)
      }))
    } catch (error) {
      console.error('Error getting category stats:', error)
      throw new Error('Failed to retrieve category stats')
    }
  }
}