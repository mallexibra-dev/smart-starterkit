import { api } from "@/lib/axios";

export interface ProductDto {
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

export async function listProducts() {
  const { data } = await api.get<{ success: boolean; message: string; data: ProductDto[] }>("/products");
  return data.data;
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