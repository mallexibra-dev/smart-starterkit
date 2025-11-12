import { db } from '../db';
import { products, categories, type ProductAPI, type CategoryAPI } from '../db/schema';
import { eq, and, like, desc, asc, gte, lte, sql, count } from 'drizzle-orm';

export type CreateProductData = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number | null;
  sku?: string;
  status?: 'active' | 'inactive';
};

export type UpdateProductData = Partial<Omit<CreateProductData, 'status'>> & { status?: 'active' | 'inactive' };

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  status?: 'active' | 'inactive';
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductResult {
  data: ProductAPI[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ProductService {
  private async enrichProductsWithCategories(productsList: any[]): Promise<ProductAPI[]> {
    const categoryIds = [...new Set(productsList.map(p => p.categoryId).filter(Boolean))];
    const categoriesMap = new Map<number, CategoryAPI>();

    if (categoryIds.length > 0) {
      const categoryResults = await db.select().from(categories).where(eq(categories.id, categoryIds[0]));

      // Get all categories at once
      const allCategories = await db.select().from(categories);
      (allCategories as any[]).forEach(cat => {
        if (categoryIds.includes(cat.id)) {
          categoriesMap.set(cat.id, {
            ...cat,
            created_at: cat.created_at.toISOString(),
            updated_at: cat.updated_at?.toISOString() || null,
          });
        }
      });
    }

    return productsList.map(product => ({
      ...product,
      price: parseFloat(product.price),
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at?.toISOString() || null,
      category: product.categoryId ? categoriesMap.get(product.categoryId) || null : null,
    }));
  }

  async getProducts(filters?: ProductFilters): Promise<ProductResult> {
    try {
      const conditions = [];

      if (filters?.search) {
        conditions.push(
          sql`(${like(products.name, `%${filters.search}%`)} OR
           ${like(products.description, `%${filters.search}%`)} OR
           ${like(products.sku, `%${filters.search}%`)})`
        );
      }

      if (filters?.categoryId) {
        conditions.push(eq(products.categoryId, filters.categoryId));
      }

      if (filters?.status) {
        conditions.push(eq(products.status, filters.status));
      }

      if (filters?.minPrice !== undefined) {
        conditions.push(gte(products.price, filters.minPrice.toString()));
      }

      if (filters?.maxPrice !== undefined) {
        conditions.push(lte(products.price, filters.maxPrice.toString()));
      }

      if (filters?.minStock !== undefined) {
        conditions.push(gte(products.stock, filters.minStock));
      }

      if (filters?.maxStock !== undefined) {
        conditions.push(lte(products.stock, filters.maxStock));
      }

      // Check if pagination is requested
      const page = Math.max(1, filters?.page || 1);
      const limit = Math.max(1, Math.min(100, filters?.limit || 10));
      const offset = (page - 1) * limit;
      const isPaginated = filters?.page !== undefined || filters?.limit !== undefined;

      if (isPaginated) {
        // Get total count
        const countQuery = db.select({ total: count() }).from(products);
        if (conditions.length > 0) {
          countQuery.where(and(...conditions));
        }
        const countResult = await countQuery;
        const total = countResult[0]?.total || 0;

        // Build ORDER BY clause
        let orderBy = desc(products.created_at);
        if (filters?.sortBy) {
          const validSortColumns = ['id', 'name', 'price', 'stock', 'status', 'created_at', 'updated_at', 'categoryId', 'sku'];
          if (validSortColumns.includes(filters.sortBy)) {
            switch (filters.sortBy) {
              case 'id':
                orderBy = filters.sortOrder === 'asc' ? asc(products.id) : desc(products.id);
                break;
              case 'name':
                orderBy = filters.sortOrder === 'asc' ? asc(products.name) : desc(products.name);
                break;
              case 'price':
                orderBy = filters.sortOrder === 'asc' ? asc(products.price) : desc(products.price);
                break;
              case 'stock':
                orderBy = filters.sortOrder === 'asc' ? asc(products.stock) : desc(products.stock);
                break;
              case 'status':
                orderBy = filters.sortOrder === 'asc' ? asc(products.status) : desc(products.status);
                break;
              case 'created_at':
                orderBy = filters.sortOrder === 'asc' ? asc(products.created_at) : desc(products.created_at);
                break;
              case 'updated_at':
                orderBy = filters.sortOrder === 'asc' ? asc(products.updated_at) : desc(products.updated_at);
                break;
              case 'categoryId':
                orderBy = filters.sortOrder === 'asc' ? asc(products.categoryId) : desc(products.categoryId);
                break;
              case 'sku':
                orderBy = filters.sortOrder === 'asc' ? asc(products.sku) : desc(products.sku);
                break;
            }
          }
        }

        // Get paginated data
        let query = db.select().from(products);
        if (conditions.length > 0) {
          query.where(and(...conditions));
        }
        const result = await query.orderBy(orderBy).limit(limit).offset(offset);

        const enrichedProducts = await this.enrichProductsWithCategories(result);
        const totalPages = Math.ceil(total / limit);

        return {
          data: enrichedProducts,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        };
      } else {
        // Get all data without pagination
        let query = db.select().from(products);
        if (conditions.length > 0) {
          query.where(and(...conditions));
        }
        const result = await query.orderBy(desc(products.created_at));

        const enrichedProducts = await this.enrichProductsWithCategories(result);
        return {
          data: enrichedProducts,
        };
      }
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Failed to retrieve products');
    }
  }

  async getProductById(id: number): Promise<ProductAPI | null> {
    try {
      const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
      const rows = result as any[];

      if (rows.length === 0) {
        return null;
      }

      const enrichedProducts = await this.enrichProductsWithCategories([rows[0]]);
      return enrichedProducts[0] || null;
    } catch (error) {
      console.error('Error getting product by id:', error);
      throw new Error('Failed to retrieve product');
    }
  }

  async createProduct(data: CreateProductData): Promise<ProductAPI> {
    try {
      const { name, description, price, stock, categoryId, sku, status = 'active' } = data;

      const insertData = {
        name,
        description: description || null,
        price: price.toString(),
        stock,
        categoryId: categoryId || null,
        sku: sku || null,
        status,
      };

      const result = await db.insert(products).values(insertData);
      const insertId = Number(result[0].insertId);

      const newProduct = await this.getProductById(insertId);
      if (!newProduct) {
        throw new Error('Failed to retrieve created product');
      }

      return newProduct;
    } catch (error: any) {
      console.error('Error creating product:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message?.includes('sku')) {
          throw new Error('Product with this SKU already exists');
        }
        throw new Error('Product already exists');
      }

      throw new Error('Failed to create product');
    }
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<ProductAPI | null> {
    try {
      const updateData: any = { ...data };
      if (data.price !== undefined) {
        updateData.price = data.price.toString();
      }

      const result = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id));

      return await this.getProductById(id);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const result = await db.delete(products).where(eq(products.id, id));
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }
}