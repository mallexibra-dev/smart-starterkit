import type { Context } from 'hono'
import { ProductService } from '../service/product.service'
import { CreateProduct, UpdateProduct, ProductQuery } from '../schemas/product.schema'

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }

  async getProducts(c: Context) {
    try {
      const query = ProductQuery.parse(c.req.query())
      const result = await this.productService.getProducts(query)

      return c.json({
        success: true,
        message: 'Products retrieved successfully',
        data: result.data,
        pagination: result.pagination,
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
      console.error('Error getting product by ID:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve product',
      }, 500)
    }
  }

  async createProduct(c: Context) {
    try {
      const body = await c.req.json()
      const validatedData = CreateProduct.parse(body)

      // Check if SKU is unique
      const isUniqueSKU = await this.productService.checkUniqueSKU(validatedData.sku)
      if (!isUniqueSKU) {
        return c.json({
          success: false,
          message: 'SKU already exists',
        }, 400)
      }

      const product = await this.productService.createProduct(validatedData)

      return c.json({
        success: true,
        message: 'Product created successfully',
        data: product,
      }, 201)
    } catch (error: any) {
      console.error('Error creating product:', error)

      if (error.name === 'ZodError') {
        return c.json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        }, 400)
      }

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

      const body = await c.req.json()
      const validatedData = UpdateProduct.parse(body)

      // Check if product exists
      const existingProduct = await this.productService.getProductById(id)
      if (!existingProduct) {
        return c.json({
          success: false,
          message: 'Product not found',
        }, 404)
      }

      // Check if SKU is unique (if being updated)
      if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
        const isUniqueSKU = await this.productService.checkUniqueSKU(validatedData.sku, id)
        if (!isUniqueSKU) {
          return c.json({
            success: false,
            message: 'SKU already exists',
          }, 400)
        }
      }

      const product = await this.productService.updateProduct(id, validatedData)

      if (!product) {
        return c.json({
          success: false,
          message: 'Failed to update product',
        }, 500)
      }

      return c.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      }, 200)
    } catch (error: any) {
      console.error('Error updating product:', error)

      if (error.name === 'ZodError') {
        return c.json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        }, 400)
      }

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

      // Check if product exists
      const existingProduct = await this.productService.getProductById(id)
      if (!existingProduct) {
        return c.json({
          success: false,
          message: 'Product not found',
        }, 404)
      }

      const deleted = await this.productService.deleteProduct(id)

      if (!deleted) {
        return c.json({
          success: false,
          message: 'Failed to delete product',
        }, 500)
      }

      return c.json({
        success: true,
        message: 'Product deleted successfully',
        data: null,
      }, 200)
    } catch (error) {
      console.error('Error deleting product:', error)

      return c.json({
        success: false,
        message: 'Failed to delete product',
      }, 500)
    }
  }

  async getLowStockProducts(c: Context) {
    try {
      const products = await this.productService.getLowStockProducts()

      return c.json({
        success: true,
        message: 'Low stock products retrieved successfully',
        data: products,
      }, 200)
    } catch (error) {
      console.error('Error getting low stock products:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve low stock products',
      }, 500)
    }
  }

  async getProductsByCategory(c: Context) {
    try {
      const category = c.req.param('category')
      const query = ProductQuery.parse(c.req.query())
      query.category = category

      const result = await this.productService.getProducts(query)

      return c.json({
        success: true,
        message: `Products in ${category} retrieved successfully`,
        data: result.data,
        pagination: result.pagination,
      }, 200)
    } catch (error) {
      console.error('Error getting products by category:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve products by category',
      }, 500)
    }
  }

  async restockProduct(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid product ID',
        }, 400)
      }

      const body = await c.req.json()
      const quantity = parseInt(body.quantity)

      if (isNaN(quantity) || quantity <= 0) {
        return c.json({
          success: false,
          message: 'Invalid quantity. Must be a positive number.',
        }, 400)
      }

      // Check if product exists
      const existingProduct = await this.productService.getProductById(id)
      if (!existingProduct) {
        return c.json({
          success: false,
          message: 'Product not found',
        }, 404)
      }

      const product = await this.productService.restockProduct(id, quantity)

      if (!product) {
        return c.json({
          success: false,
          message: 'Failed to restock product',
        }, 500)
      }

      return c.json({
        success: true,
        message: `Product restocked with ${quantity} units successfully`,
        data: product,
      }, 200)
    } catch (error) {
      console.error('Error restocking product:', error)

      return c.json({
        success: false,
        message: 'Failed to restock product',
      }, 500)
    }
  }

  async getProductStats(c: Context) {
    try {
      const stats = await this.productService.getProductStats()

      return c.json({
        success: true,
        message: 'Product stats retrieved successfully',
        data: stats,
      }, 200)
    } catch (error) {
      console.error('Error getting product stats:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve product stats',
      }, 500)
    }
  }

  async getCategoryStats(c: Context) {
    try {
      const stats = await this.productService.getCategoryStats()

      return c.json({
        success: true,
        message: 'Category stats retrieved successfully',
        data: stats,
      }, 200)
    } catch (error) {
      console.error('Error getting category stats:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve category stats',
      }, 500)
    }
  }

  async activateProduct(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid product ID',
        }, 400)
      }

      const product = await this.productService.activateProduct(id)
      if (!product) {
        return c.json({
          success: false,
          message: 'Product not found',
        }, 404)
      }

      return c.json({
        success: true,
        message: 'Product activated successfully',
        data: product,
      }, 200)
    } catch (error) {
      console.error('Error activating product:', error)

      return c.json({
        success: false,
        message: 'Failed to activate product',
      }, 500)
    }
  }

  async deactivateProduct(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      if (isNaN(id)) {
        return c.json({
          success: false,
          message: 'Invalid product ID',
        }, 400)
      }

      const product = await this.productService.deactivateProduct(id)
      if (!product) {
        return c.json({
          success: false,
          message: 'Product not found',
        }, 404)
      }

      return c.json({
        success: true,
        message: 'Product deactivated successfully',
        data: product,
      }, 200)
    } catch (error) {
      console.error('Error deactivating product:', error)

      return c.json({
        success: false,
        message: 'Failed to deactivate product',
      }, 500)
    }
  }
}