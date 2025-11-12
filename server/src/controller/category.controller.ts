import type { Context } from 'hono'
import { CategoryService } from '../service/category.service'
import { ResponseHelper, type PaginatedData } from '../utils/response.helper'
import type { CreateCategoryData, UpdateCategoryData, CategoryFilters } from '../service/category.service'
import type { CategoryResult } from '../service/category.service'

export class CategoryController {
  private categoryService: CategoryService

  constructor() {
    this.categoryService = new CategoryService()
  }

  async getCategories(c: Context) {
    try {
      const queryParams = c.req.query()
      const filters: CategoryFilters = {}

      // Use validated query params if available, otherwise use raw params
      const validatedParams = (c as any).get('validatedQueryParams');

      filters.search = validatedParams?.search || queryParams.search
      filters.status = validatedParams?.status || queryParams.status
      filters.page = validatedParams?.page || (queryParams.page ? parseInt(queryParams.page) : undefined)
      filters.limit = validatedParams?.limit || (queryParams.limit ? parseInt(queryParams.limit) : undefined)
      filters.sortBy = validatedParams?.sortBy || queryParams.sortBy
      filters.sortOrder = validatedParams?.sortOrder || queryParams.sortOrder

      const result: CategoryResult = await this.categoryService.getCategories(filters)

      // Check if result has pagination, if so format it as PaginatedData
      if (result.pagination) {
        const responseData: PaginatedData<typeof result.data[0]> = {
          data: result.data,
          pagination: result.pagination,
        }
        return ResponseHelper.success(c, 'Categories retrieved successfully', responseData)
      } else {
        return ResponseHelper.success(c, 'Categories retrieved successfully', result.data)
      }
    } catch (error) {
      console.error('Error getting categories:', error)
      return ResponseHelper.serverError(c, 'Failed to retrieve categories')
    }
  }

  async getCategoryById(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return ResponseHelper.badRequest(c, 'Invalid category ID')
      }

      const category = await this.categoryService.getCategoryById(id)

      if (!category) {
        return ResponseHelper.notFound(c, 'Category')
      }

      return ResponseHelper.success(c, 'Category retrieved successfully', category)
    } catch (error) {
      console.error('Error getting category by id:', error)
      return ResponseHelper.serverError(c, 'Failed to retrieve category')
    }
  }

  async getActiveCategories(c: Context) {
    try {
      const categories = await this.categoryService.getActiveCategories()
      return ResponseHelper.success(c, 'Active categories retrieved successfully', categories)
    } catch (error) {
      console.error('Error getting active categories:', error)
      return ResponseHelper.serverError(c, 'Failed to retrieve active categories')
    }
  }

  async createCategory(c: Context) {
    try {
      const body = await c.req.json() as CreateCategoryData

      const category = await this.categoryService.createCategory(body)

      return ResponseHelper.created(c, 'Category created successfully', category)
    } catch (error: any) {
      console.error('Error creating category:', error)

      let message = 'Failed to create category'
      if (error.message.includes('already exists')) {
        message = error.message
        return ResponseHelper.conflict(c, message)
      }

      return ResponseHelper.serverError(c, message)
    }
  }

  async updateCategory(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return ResponseHelper.badRequest(c, 'Invalid category ID')
      }

      const body = await c.req.json() as UpdateCategoryData

      const category = await this.categoryService.updateCategory(id, body)

      if (!category) {
        return ResponseHelper.notFound(c, 'Category')
      }

      return ResponseHelper.success(c, 'Category updated successfully', category)
    } catch (error) {
      console.error('Error updating category:', error)
      return ResponseHelper.serverError(c, 'Failed to update category')
    }
  }

  async deleteCategory(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return ResponseHelper.badRequest(c, 'Invalid category ID')
      }

      try {
        const deleted = await this.categoryService.deleteCategory(id)

        if (!deleted) {
          return ResponseHelper.notFound(c, 'Category')
        }

        return ResponseHelper.success(c, 'Category deleted successfully')
      } catch (error: any) {
        if (error.message.includes('Cannot delete category')) {
          return ResponseHelper.badRequest(c, error.message)
        }
        throw error
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      return ResponseHelper.serverError(c, 'Failed to delete category')
    }
  }
}