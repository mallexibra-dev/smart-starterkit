import { api } from "@/lib/axios";

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
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedProductsResponse {
  data: ProductDto[];
  pagination: PaginationInfo;
}

export type ProductDto = Product;

export async function listProducts(filters?: ProductFilters) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const url = queryString ? `/products?${queryString}` : "/products";

  const { data } = await api.get<{ success: boolean; message: string; data: ProductDto[]; pagination?: PaginationInfo }>(url);

  if (data.pagination) {
    return {
      data: data.data,
      pagination: data.pagination
    } as PaginatedProductsResponse;
  }

  return data.data;
}

export async function listPaginatedProducts(filters: ProductFilters & { page: number; limit: number }) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const { data } = await api.get<{ success: boolean; message: string; data: ProductDto[]; pagination: PaginationInfo }>(`/products?${params.toString()}`);

  return {
    data: data.data,
    pagination: data.pagination
  } as PaginatedProductsResponse;
}

export async function getProduct(id: number) {
  const { data } = await api.get<{ success: boolean; message: string; data: ProductDto }>(`/products/${id}`);
  return data.data;
}

export async function createProduct(payload: CreateProductInput) {
  const { data } = await api.post<{ success: boolean; message: string; data: ProductDto }>("/products", payload);
  return data.data;
}

export async function updateProduct(id: number, payload: UpdateProductInput) {
  const { data } = await api.put<{ success: boolean; message: string; data: ProductDto }>(`/products/${id}`, payload);
  return data.data;
}

export async function deleteProduct(id: number) {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/products/${id}`);
  return data.success;
} 