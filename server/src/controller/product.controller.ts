import type { Context } from 'hono'
import { ProductService, CreateProductData, UpdateProductData } from '../service/product.service'

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }

  async getProducts(c: Context) {
    try {
      const products = await this.productService.getProducts()
      
      return c.json({
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      }, 200)
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
