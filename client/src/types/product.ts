// Import category type from shared
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

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  category?: Category; // Populated from JOIN
  status: ProductStatus;
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
  price: number;
  category_id: number;
  status?: ProductStatus;
  sku: string;
  stock_quantity?: number;
  min_stock_level?: number;
  weight?: number;
  dimensions?: string;
  images?: string[];
  tags?: string[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category_id?: number;
  status?: ProductStatus;
  sku?: string;
  stock_quantity?: number;
  min_stock_level?: number;
  weight?: number;
  dimensions?: string;
  images?: string[];
  tags?: string[];
}

export interface ProductQuery {
  page: number;
  limit: number;
  category_id?: number;
  category_slug?: string;
  status?: ProductStatus;
  search?: string;
  sort_by: 'name' | 'price' | 'created_at' | 'updated_at';
  sort_order: 'asc' | 'desc';
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

export type ProductStatus = 'active' | 'inactive' | 'draft' | 'archived';

// Category options should be fetched from database
// This is a fallback type for type safety
export const ProductStatusOptions: { value: ProductStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'draft', label: 'Draft', color: 'yellow' },
  { value: 'archived', label: 'Archived', color: 'red' },
];

// Category options interface - should be populated from API call
export interface CategoryOption {
  value: number; // category_id
  label: string; // category name
  slug: string;
  color?: string;
  icon?: string;
}

// For backward compatibility - this should be populated from API
export const ProductCategoryOptions: CategoryOption[] = [
  { value: 1, label: "Electronics", slug: "electronics", color: "blue", icon: "laptop" },
  { value: 2, label: "Clothing", slug: "clothing", color: "purple", icon: "shirt" },
  { value: 3, label: "Food", slug: "food", color: "green", icon: "apple" },
  { value: 4, label: "Books", slug: "books", color: "orange", icon: "book" },
  { value: 5, label: "Home", slug: "home", color: "brown", icon: "home" },
  { value: 6, label: "Sports", slug: "sports", color: "red", icon: "football" },
  { value: 7, label: "Toys", slug: "toys", color: "pink", icon: "puzzle" },
  { value: 8, label: "Health", slug: "health", color: "teal", icon: "heart" },
  { value: 9, label: "Automotive", slug: "automotive", color: "gray", icon: "car" },
  { value: 10, label: "Other", slug: "other", color: "gray", icon: "package" },
];