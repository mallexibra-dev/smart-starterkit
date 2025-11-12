import { db } from '../db';
import { categories, products, type CategoryAPI, type ProductAPI } from '../db/schema';
import { eq, and, like, desc, asc, count, sql, inArray } from 'drizzle-orm';

export type CreateCategoryData = {
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
};

export type UpdateCategoryData = Partial<Omit<CreateCategoryData, 'status'>> & { status?: 'active' | 'inactive' };

export interface CategoryFilters {
  search?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryResult {
  data: CategoryAPI[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class CategoryService {
  private async enrichCategoriesWithProducts(categoriesList: any[]): Promise<CategoryAPI[]> {
    const categoryIds = [...new Set(categoriesList.map(c => c.id))];

    if (categoryIds.length === 0) {
      return categoriesList.map(category => ({
        ...category,
        created_at: category.created_at.toISOString(),
        updated_at: category.updated_at?.toISOString() || null,
        products: [],
      }));
    }

    // Get all products that belong to these categories
    let categoryProducts: any[] = [];
    if (categoryIds.length === 1) {
      categoryProducts = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, categoryIds[0]));
    } else {
      // Use IN clause for multiple category IDs
      categoryProducts = await db
        .select()
        .from(products)
        .where(inArray(products.categoryId, categoryIds));
    }

    // Group products by categoryId
    const productsByCategory = new Map<number, ProductAPI[]>();

    categoryProducts.forEach(product => {
      if (!productsByCategory.has(product.categoryId)) {
        productsByCategory.set(product.categoryId, []);
      }

      const enrichedProduct: ProductAPI = {
        ...product,
        price: parseFloat(product.price),
        created_at: product.created_at.toISOString(),
        updated_at: product.updated_at?.toISOString() || null,
        category: undefined, // Avoid circular reference
      };

      productsByCategory.get(product.categoryId)!.push(enrichedProduct);
    });

    return categoriesList.map(category => ({
      ...category,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at?.toISOString() || null,
      products: productsByCategory.get(category.id) || [],
    }));
  }

  async getCategories(filters?: CategoryFilters): Promise<CategoryResult> {
    try {
      const conditions = [];

      if (filters?.search) {
        conditions.push(
          sql`(${like(categories.name, `%${filters.search}%`)} OR
           ${like(categories.description, `%${filters.search}%`)})`
        );
      }

      if (filters?.status) {
        conditions.push(eq(categories.status, filters.status));
      }

      // Check if pagination is requested
      const page = Math.max(1, filters?.page || 1);
      const limit = Math.max(1, Math.min(100, filters?.limit || 10));
      const offset = (page - 1) * limit;
      const isPaginated = filters?.page !== undefined || filters?.limit !== undefined;

      if (isPaginated) {
        // Get total count
        const countQuery = db.select({ total: count() }).from(categories);
        if (conditions.length > 0) {
          countQuery.where(and(...conditions));
        }
        const countResult = await countQuery;
        const total = countResult[0]?.total || 0;

        // Build ORDER BY clause
        let orderBy = desc(categories.created_at);
        if (filters?.sortBy) {
          const validSortColumns = ['id', 'name', 'status', 'created_at', 'updated_at'];
          if (validSortColumns.includes(filters.sortBy)) {
            switch (filters.sortBy) {
              case 'id':
                orderBy = filters.sortOrder === 'asc' ? asc(categories.id) : desc(categories.id);
                break;
              case 'name':
                orderBy = filters.sortOrder === 'asc' ? asc(categories.name) : desc(categories.name);
                break;
              case 'status':
                orderBy = filters.sortOrder === 'asc' ? asc(categories.status) : desc(categories.status);
                break;
              case 'created_at':
                orderBy = filters.sortOrder === 'asc' ? asc(categories.created_at) : desc(categories.created_at);
                break;
              case 'updated_at':
                orderBy = filters.sortOrder === 'asc' ? asc(categories.updated_at) : desc(categories.updated_at);
                break;
            }
          }
        }

        // Get paginated data
        let query = db.select().from(categories);
        if (conditions.length > 0) {
          query.where(and(...conditions));
        }
        const result = await query.orderBy(orderBy).limit(limit).offset(offset);

        const enrichedCategories = await this.enrichCategoriesWithProducts(result as any[]);

        const totalPages = Math.ceil(total / limit);

        return {
          data: enrichedCategories,
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
        let query = db.select().from(categories);
        if (conditions.length > 0) {
          query.where(and(...conditions));
        }
        const result = await query.orderBy(desc(categories.created_at));

        const enrichedCategories = await this.enrichCategoriesWithProducts(result as any[]);

        return {
          data: enrichedCategories,
        };
      }
    } catch (error) {
      console.error('Error getting categories:', error);
      throw new Error('Failed to retrieve categories');
    }
  }

  async getCategoryById(id: number): Promise<CategoryAPI | null> {
    try {
      const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
      const rows = result as any[];

      if (rows.length === 0) {
        return null;
      }

      const enrichedCategories = await this.enrichCategoriesWithProducts(rows);
      return enrichedCategories[0] || null;
    } catch (error) {
      console.error('Error getting category by id:', error);
      throw new Error('Failed to retrieve category');
    }
  }

  async getActiveCategories(): Promise<CategoryAPI[]> {
    try {
      const result = await db.select().from(categories).where(eq(categories.status, 'active')).orderBy(asc(categories.name));

      return await this.enrichCategoriesWithProducts(result as any[]);
    } catch (error) {
      console.error('Error getting active categories:', error);
      throw new Error('Failed to retrieve active categories');
    }
  }

  async createCategory(data: CreateCategoryData): Promise<CategoryAPI> {
    try {
      const { name, description, status = 'active' } = data;

      const insertData = {
        name,
        description: description || null,
        status,
      };

      const result = await db.insert(categories).values(insertData);
      const insertId = Number(result[0].insertId);

      const newCategory = await this.getCategoryById(insertId);
      if (!newCategory) {
        throw new Error('Failed to retrieve created category');
      }

      return newCategory;
    } catch (error: any) {
      console.error('Error creating category:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message?.includes('name')) {
          throw new Error('Category with this name already exists');
        }
        throw new Error('Category already exists');
      }

      throw new Error('Failed to create category');
    }
  }

  async updateCategory(id: number, data: UpdateCategoryData): Promise<CategoryAPI | null> {
    try {
      await db
        .update(categories)
        .set(data)
        .where(eq(categories.id, id));

      return await this.getCategoryById(id);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      // Check if category has products
      const { products } = await import('../db/schema');
      const productCount = await db
        .select({ count: count() })
        .from(products)
        .where(eq(products.categoryId, id));

      const productCountResult = productCount[0]?.count || 0;

      if (productCountResult > 0) {
        throw new Error('Cannot delete category with associated products');
      }

      const result = await db.delete(categories).where(eq(categories.id, id));
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }
}