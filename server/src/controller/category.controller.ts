import { OpenAPIHono } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { CategoryService } from '../service/category.service'
import {
  Category,
  CreateCategory,
  UpdateCategory,
  UpdateSortOrder,
  CategoryStats,
  CategoryStatsOk
} from '../schemas/category.schema'
import { BaseOk, BaseError } from '../schemas/base.schema'

export class CategoryController {
  private categoryService: CategoryService

  constructor() {
    this.categoryService = new CategoryService()
  }

  
  // GET /categories - List all active categories
  async getCategories(c: any) {
    try {
      const categories = await this.categoryService.getCategories()

      return c.json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      }, 200)
    } catch (error) {
      console.error('Error in getCategories:', error)
      return c.json({
        success: false,
        message: 'Failed to retrieve categories',
      }, 500)
    }
  }

  // GET /categories/all - List all categories including inactive
  async getAllCategories(c: any) {
    try {
      const categories = await this.categoryService.getAllCategories()

      return c.json({
        success: true,
        message: 'All categories retrieved successfully',
        data: categories,
      }, 200)
    } catch (error) {
      console.error('Error in getAllCategories:', error)
      return c.json({
        success: false,
        message: 'Failed to retrieve categories',
      }, 500)
    }
  }

  // GET /categories/{id} - Get category by ID
  async getCategoryById(c: any) {
    try {
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid category ID',
        }, 400)
      }

      const category = await this.categoryService.getCategoryById(id)

      if (!category) {
        return c.json({
          success: false,
          message: 'Category not found',
        }, 404)
      }

      return c.json({
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      }, 200)
    } catch (error) {
      console.error('Error in getCategoryById:', error)
      return c.json({
        success: false,
        message: 'Failed to retrieve category',
      }, 500)
    }
  }

  // GET /categories/slug/{slug} - Get category by slug
  async getCategoryBySlug(c: any) {
    try {
      const slug = c.req.param('slug')

      const category = await this.categoryService.getCategoryBySlug(slug)

      if (!category) {
        return c.json({
          success: false,
          message: 'Category not found',
        }, 404)
      }

      return c.json({
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      }, 200)
    } catch (error) {
      console.error('Error in getCategoryBySlug:', error)
      return c.json({
        success: false,
        message: 'Failed to retrieve category',
      }, 500)
    }
  }

  // POST /categories - Create new category
  async createCategory(c: any) {
    try {
      const body = await c.req.json()

      // Check if slug is unique
      const isSlugUnique = await this.categoryService.checkUniqueSlug(body.slug)
      if (!isSlugUnique) {
        return c.json({
          success: false,
          message: 'Category with this slug already exists',
        }, 409)
      }

      const category = await this.categoryService.createCategory(body)

      return c.json({
        success: true,
        message: 'Category created successfully',
        data: category,
      }, 201)
    } catch (error) {
      console.error('Error in createCategory:', error)
      return c.json({
        success: false,
        message: 'Failed to create category',
      }, 500)
    }
  }

  // PUT /categories/{id} - Update category
  async updateCategory(c: any) {
    try {
      const id = parseInt(c.req.param('id'))
      const body = await c.req.json()

      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid category ID',
        }, 400)
      }

      // Check if category exists
      const existingCategory = await this.categoryService.getCategoryById(id)
      if (!existingCategory) {
        return c.json({
          success: false,
          message: 'Category not found',
        }, 404)
      }

      // Check if slug is unique (if slug is being updated)
      if (body.slug && body.slug !== existingCategory.slug) {
        const isSlugUnique = await this.categoryService.checkUniqueSlug(body.slug, id)
        if (!isSlugUnique) {
          return c.json({
            success: false,
            message: 'Category with this slug already exists',
          }, 409)
        }
      }

      const category = await this.categoryService.updateCategory(id, body)

      return c.json({
        success: true,
        message: 'Category updated successfully',
        data: category,
      }, 200)
    } catch (error) {
      console.error('Error in updateCategory:', error)
      return c.json({
        success: false,
        message: 'Failed to update category',
      }, 500)
    }
  }

  // PUT /categories/sort-order - Update categories sort order
  async updateSortOrder(c: any) {
    try {
      const body = await c.req.json()

      await this.categoryService.updateSortOrder(body.categories)

      return c.json({
        success: true,
        message: 'Sort order updated successfully',
      }, 200)
    } catch (error) {
      console.error('Error in updateSortOrder:', error)
      return c.json({
        success: false,
        message: 'Failed to update sort order',
      }, 500)
    }
  }

  // DELETE /categories/{id} - Delete category
  async deleteCategory(c: any) {
    try {
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid category ID',
        }, 400)
      }

      const success = await this.categoryService.deleteCategory(id)

      if (!success) {
        return c.json({
          success: false,
          message: 'Category not found',
        }, 404)
      }

      return c.json({
        success: true,
        message: 'Category deleted successfully',
      }, 200)
    } catch (error: any) {
      console.error('Error in deleteCategory:', error)

      if (error.message.includes('Cannot delete category with existing products')) {
        return c.json({
          success: false,
          message: 'Cannot delete category with existing products',
        }, 400)
      }

      return c.json({
        success: false,
        message: 'Failed to delete category',
      }, 500)
    }
  }

  // GET /categories/stats - Get category statistics
  async getCategoryStats(c: any) {
    try {
      const stats = await this.categoryService.getCategoryStats()

      return c.json({
        success: true,
        message: 'Category statistics retrieved successfully',
        data: stats,
      }, 200)
    } catch (error) {
      console.error('Error in getCategoryStats:', error)
      return c.json({
        success: false,
        message: 'Failed to retrieve category statistics',
      }, 500)
    }
  }
}