import { api } from '@/lib/axios';
import type {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductQuery,
  ProductListResponse
} from 'shared/src/types/products.type';

export class ProductService {
  private readonly baseUrl = '/products';

  async getProducts(query: Partial<ProductQuery> = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();

    // Set default values
    const finalQuery: ProductQuery = {
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...query
    };

    Object.entries(finalQuery).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const url = `${this.baseUrl}?${params.toString()}`;
    console.log('Fetching products from URL:', url);
    const response = await api.get(url);

    // Handle the API response structure
    if (response.data && response.data.data) {
      return response.data;
    }

    // Fallback if response structure is different
    return {
      data: response.data || [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        total_pages: 0
      }
    };
  }

  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    const response = await api.post(this.baseUrl, data);
    return response.data.data;
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<Product> {
    const response = await api.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async getLowStockProducts(): Promise<Product[]> {
    const response = await api.get(`${this.baseUrl}/low-stock`);
    return response.data.data;
  }

  async getProductsByCategory(category: string, query: Partial<ProductQuery> = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();

    // Set default values
    const finalQuery: ProductQuery = {
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...query
    };

    Object.entries(finalQuery).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await api.get(`${this.baseUrl}/category/${category}?${params.toString()}`);
    return response.data;
  }

  async restockProduct(id: number, quantity: number): Promise<Product> {
    const response = await api.post(`${this.baseUrl}/${id}/restock`, { quantity });
    return response.data.data;
  }

  async activateProduct(id: number): Promise<Product> {
    const response = await api.put(`${this.baseUrl}/${id}/activate`);
    return response.data.data;
  }

  async deactivateProduct(id: number): Promise<Product> {
    const response = await api.put(`${this.baseUrl}/${id}/deactivate`);
    return response.data.data;
  }

  async getProductStats(): Promise<{
    total_products: number;
    low_stock: number;
    out_of_stock: number;
    active: number;
  }> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data.data;
  }

  async getCategoryStats(): Promise<Array<{
    category: string;
    count: number;
    lowStockCount: number;
    totalValue: number;
    avgPrice: number;
  }>> {
    const response = await api.get(`${this.baseUrl}/categories/stats`);
    return response.data.data;
  }

  // Utility methods
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  getStockStatus(product: Product): 'low' | 'normal' | 'out' {
    if (!product) return 'out';
    if (product.stock_quantity === 0) return 'out';
    if (product.stock_quantity <= (product.min_stock_level || 0)) return 'low';
    return 'normal';
  }

  isLowStock(product: Product): boolean {
    if (!product) return false;
    return product.stock_quantity <= (product.min_stock_level || 0) && product.stock_quantity > 0;
  }

  isOutOfStock(product: Product): boolean {
    if (!product) return true;
    return product.stock_quantity === 0;
  }
}

export const productService = new ProductService();