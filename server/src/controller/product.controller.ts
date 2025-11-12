import type { Context } from 'hono'
import { ProductService } from '../service/product.service'
import { ResponseHelper, type PaginatedData } from '../utils/response.helper'
import type { CreateProductData, UpdateProductData, ProductFilters } from '../service/product.service'
import type { ProductResult } from '../service/product.service'

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }

  async getProducts(c: Context) {
    try {
      const queryParams = c.req.query()
      const filters: ProductFilters = {}

      // Use validated query params if available, otherwise use raw params
      const validatedParams = (c as any).get('validatedQueryParams');

      filters.search = validatedParams?.search || queryParams.search
      filters.categoryId = validatedParams?.categoryId || (queryParams.categoryId ? parseInt(queryParams.categoryId) : undefined)
      filters.status = validatedParams?.status || queryParams.status
      filters.minPrice = validatedParams?.minPrice || (queryParams.minPrice ? parseFloat(queryParams.minPrice) : undefined)
      filters.maxPrice = validatedParams?.maxPrice || (queryParams.maxPrice ? parseFloat(queryParams.maxPrice) : undefined)
      filters.minStock = validatedParams?.minStock || (queryParams.minStock ? parseInt(queryParams.minStock) : undefined)
      filters.maxStock = validatedParams?.maxStock || (queryParams.maxStock ? parseInt(queryParams.maxStock) : undefined)
      filters.page = validatedParams?.page || (queryParams.page ? parseInt(queryParams.page) : undefined)
      filters.limit = validatedParams?.limit || (queryParams.limit ? parseInt(queryParams.limit) : undefined)
      filters.sortBy = validatedParams?.sortBy || queryParams.sortBy
      filters.sortOrder = validatedParams?.sortOrder || queryParams.sortOrder

      const result: ProductResult = await this.productService.getProducts(filters)

      // Check if result has pagination, if so format it as PaginatedData
      if (result.pagination) {
        const responseData: PaginatedData<typeof result.data[0]> = {
          data: result.data,
          pagination: result.pagination,
        }
        return ResponseHelper.success(c, 'Products retrieved successfully', responseData)
      } else {
        return ResponseHelper.success(c, 'Products retrieved successfully', result.data)
      }
    } catch (error) {
      console.error('Error getting products:', error)
      return ResponseHelper.serverError(c, 'Failed to retrieve products')
    }
  }

  async getProductById(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return ResponseHelper.badRequest(c, 'Invalid product ID')
      }

      const product = await this.productService.getProductById(id)

      if (!product) {
        return ResponseHelper.notFound(c, 'Product')
      }

      return ResponseHelper.success(c, 'Product retrieved successfully', product)
    } catch (error) {
      console.error('Error getting product by id:', error)
      return ResponseHelper.serverError(c, 'Failed to retrieve product')
    }
  }

  async createProduct(c: Context) {
    try {
      const body = await c.req.json() as CreateProductData

      const product = await this.productService.createProduct(body)

      return ResponseHelper.created(c, 'Product created successfully', product)
    } catch (error: any) {
      console.error('Error creating product:', error)

      let message = 'Failed to create product'
      if (error.message.includes('already exists')) {
        message = error.message
        return ResponseHelper.conflict(c, message)
      }

      return ResponseHelper.serverError(c, message)
    }
  }

  async updateProduct(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return ResponseHelper.badRequest(c, 'Invalid product ID')
      }

      const body = await c.req.json() as UpdateProductData

      const product = await this.productService.updateProduct(id, body)

      if (!product) {
        return ResponseHelper.notFound(c, 'Product')
      }

      return ResponseHelper.success(c, 'Product updated successfully', product)
    } catch (error) {
      console.error('Error updating product:', error)
      return ResponseHelper.serverError(c, 'Failed to update product')
    }
  }

  async deleteProduct(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return ResponseHelper.badRequest(c, 'Invalid product ID')
      }

      const deleted = await this.productService.deleteProduct(id)

      if (!deleted) {
        return ResponseHelper.notFound(c, 'Product')
      }

      return ResponseHelper.success(c, 'Product deleted successfully')
    } catch (error) {
      console.error('Error deleting product:', error)
      return ResponseHelper.serverError(c, 'Failed to delete product')
    }
  }
}