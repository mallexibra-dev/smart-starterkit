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

// Re-export from validation to avoid conflicts
export type { CreateProductInput, UpdateProductInput, ProductFilters } from "../validation/products.validation";