import type { Context } from 'hono'
import { ProductService } from '../service/product.service'
import type { CreateProductData, UpdateProductData, ProductFilters } from '../service/product.service'
import type { PaginatedProducts } from '../service/product.service'

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }

  async getProducts(c: Context) {
    try {
      const queryParams = c.req.query()
      const filters: ProductFilters = {}

      if (queryParams.search) filters.search = queryParams.search
      if (queryParams.category) filters.category = queryParams.category
      if (queryParams.status) filters.status = queryParams.status as 'active' | 'inactive'
      if (queryParams.minPrice) filters.minPrice = parseFloat(queryParams.minPrice)
      if (queryParams.maxPrice) filters.maxPrice = parseFloat(queryParams.maxPrice)
      if (queryParams.minStock) filters.minStock = parseInt(queryParams.minStock)
      if (queryParams.maxStock) filters.maxStock = parseInt(queryParams.maxStock)
      if (queryParams.page) filters.page = parseInt(queryParams.page)
      if (queryParams.limit) filters.limit = parseInt(queryParams.limit)
      if (queryParams.sortBy) filters.sortBy = queryParams.sortBy
      if (queryParams.sortOrder) filters.sortOrder = queryParams.sortOrder as 'asc' | 'desc'

      // Check if pagination is requested
      const isPaginated = filters.page !== undefined || filters.limit !== undefined

      if (isPaginated) {
        const result: PaginatedProducts = await this.productService.getPaginatedProducts(filters)

        return c.json({
          success: true,
          message: 'Products retrieved successfully',
          data: result.data,
          pagination: result.pagination,
        }, 200)
      } else {
        const products = await this.productService.getProducts(filters)

        return c.json({
          success: true,
          message: 'Products retrieved successfully',
          data: products,
        }, 200)
      }
    } catch (error) {
      console.error('Error getting products:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve products',
      }, 500)
    }
  }

  async getProductById(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      
      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid product ID',
        }, 400)
      }

      const product = await this.productService.getProductById(id)
      
      if (!product) {
        return c.json({
          success: false,
          message: 'Product not found',
        }, 404)
      }
      
      return c.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      }, 200)
    } catch (error) {
      console.error('Error getting product by id:', error)
      
      return c.json({
        success: false,
        message: 'Failed to retrieve product',
      }, 500)
    }
  }

  async createProduct(c: Context) {
    try {
      const body = await c.req.json() as CreateProductData
      
      const product = await this.productService.createProduct(body)
      
      return c.json({
        success: true,
        message: 'Product created successfully',
        data: product,
      }, 201)
    } catch (error) {
      console.error('Error creating product:', error)
      
      return c.json({
        success: false,
        message: 'Failed to create product',
      }, 500)
    }
  }

  async updateProduct(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      
      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid product ID',
        }, 400)
      }

      const body = await c.req.json() as UpdateProductData
      
      const product = await this.productService.updateProduct(id, body)
      
      if (!product) {
        return c.json({
          success: false,
          message: 'Product not found',
        }, 404)
      }
      
      return c.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      }, 200)
    } catch (error) {
      console.error('Error updating product:', error)
      
      return c.json({
        success: false,
        message: 'Failed to update product',
      }, 500)
    }
  }

  async deleteProduct(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      
      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid product ID',
        }, 400)
      }

      const deleted = await this.productService.deleteProduct(id)
      
      if (!deleted) {
        return c.json({
          success: false,
          message: 'Product not found',
        }, 404)
      }
      
      return c.json({
        success: true,
        message: 'Product deleted successfully',
      }, 200)
    } catch (error) {
      console.error('Error deleting product:', error)
      
      return c.json({
        success: false,
        message: 'Failed to delete product',
      }, 500)
    }
  }
}
