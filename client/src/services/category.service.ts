import { api } from '@/lib/axios'
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  ApiResponse
} from 'shared/src/types/category.type'

class CategoryService {

  // Get all active categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<ApiResponse>('/categories')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  // Get all categories (including inactive)
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get<ApiResponse>('/categories/all')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching all categories:', error)
      throw error
    }
  }

  // Get category by ID
  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const response = await api.get<ApiResponse>(`/categories/${id}`)
      return response.data.data || null
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await api.get<ApiResponse>(`/categories/slug/${slug}`)
      return response.data.data || null
    } catch (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }
  }

  // Create new category
  async createCategory(data: CreateCategoryData): Promise<Category> {
    try {
      const response = await api.post<ApiResponse>('/categories', data)
      if (response.data.success && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to create category')
    } catch (error: any) {
      console.error('Error creating category:', error)
      const message = error.response?.data?.message || error.message || 'Failed to create category'
      throw new Error(message)
    }
  }

  // Update category
  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category | null> {
    try {
      const response = await api.put<ApiResponse>(`/categories/${id}`, data)
      if (response.data.success && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to update category')
    } catch (error: any) {
      console.error('Error updating category:', error)
      const message = error.response?.data?.message || error.message || 'Failed to update category'
      throw new Error(message)
    }
  }

  // Delete category
  async deleteCategory(id: number): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse>(`/categories/${id}`)
      return response.data.success
    } catch (error: any) {
      console.error('Error deleting category:', error)
      const message = error.response?.data?.message || error.message || 'Failed to delete category'
      throw new Error(message)
    }
  }

  // Update sort order of multiple categories
  async updateSortOrder(categoryUpdates: { id: number; sort_order: number }[]): Promise<boolean> {
    try {
      const response = await api.put<ApiResponse>('/categories/sort-order', {
        categories: categoryUpdates
      })
      return response.data.success
    } catch (error: any) {
      console.error('Error updating sort order:', error)
      const message = error.response?.data?.message || error.message || 'Failed to update sort order'
      throw new Error(message)
    }
  }

  // Get category statistics
  async getCategoryStats(): Promise<any[]> {
    try {
      const response = await api.get<ApiResponse>('/categories/stats')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching category stats:', error)
      throw error
    }
  }

  // Get category options for dropdown/select
  async getCategoryOptions(): Promise<{ value: number; label: string; slug: string; color?: string; icon?: string }[]> {
    try {
      const categories = await this.getCategories()
      return categories.map(cat => ({
        value: cat.id,
        label: cat.name,
        slug: cat.slug,
        color: cat.color || undefined,
        icon: cat.icon || undefined
      }))
    } catch (error) {
      console.error('Error fetching category options:', error)
      return []
    }
  }

  // Check if slug is unique (for form validation)
  async checkUniqueSlug(slug: string, excludeId?: number): Promise<boolean> {
    try {
      const existingCategory = await this.getCategoryBySlug(slug)
      return !existingCategory || existingCategory.id === excludeId
    } catch (error) {
      console.error('Error checking slug uniqueness:', error)
      return false
    }
  }

  // Generate slug from name (utility function)
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }
}

export const categoryService = new CategoryService()
export default categoryService