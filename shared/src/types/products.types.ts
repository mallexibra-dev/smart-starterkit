export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  sku: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string | null;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  sku?: string;
  status?: "active" | "inactive";
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  sku?: string;
  status?: "active" | "inactive";
}

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: "active" | "inactive";
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
}