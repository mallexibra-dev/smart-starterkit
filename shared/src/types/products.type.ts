export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  category?: Category | null;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  sku: string;
  stock_quantity: number;
  min_stock_level: number;
  weight: number | null;
  dimensions: string | null;
  images: string[] | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number | string;
  category_id: number;
  status?: 'active' | 'inactive' | 'draft' | 'archived';
  sku: string;
  stock_quantity?: number | string;
  min_stock_level?: number | string;
  weight?: number | string | null;
  dimensions?: string;
  images?: string[];
  tags?: string[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number | string;
  category_id?: number;
  status?: 'active' | 'inactive' | 'draft' | 'archived';
  sku?: string;
  stock_quantity?: number | string;
  min_stock_level?: number | string;
  weight?: number | string | null;
  dimensions?: string;
  images?: string[];
  tags?: string[];
}

export interface RestockProductData {
  quantity: number;
}

export interface ProductQuery {
  page?: number | string;
  limit?: number | string;
  category_id?: number | string;
  category_slug?: string;
  status?: string;
  search?: string;
  sort_by?: 'name' | 'price' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

export interface CategoryParams {
  category_slug: string;
}

export interface ProductListResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ProductStats {
  total_products: number;
  low_stock: number;
  out_of_stock: number;
  active: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string | null;
}

export interface CategoryStats {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  product_count: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_value: number;
}

export interface BaseApiResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T> extends BaseApiResponse {
  data?: T;
}

export interface ApiResponseWithData<T> extends BaseApiResponse {
  data: T;
}