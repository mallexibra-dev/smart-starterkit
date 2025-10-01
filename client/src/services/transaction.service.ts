import { api } from "@/lib/axios";

export interface TransactionDto {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  transaction_type: "purchase" | "sale" | "return";
  status: "pending" | "completed" | "cancelled" | "refunded";
  payment_method: string | null;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateTransactionInput {
  user_id: number;
  product_id: number;
  quantity?: number;
  unit_price: number;
  total_price: number;
  transaction_type?: "purchase" | "sale" | "return";
  status?: "pending" | "completed" | "cancelled" | "refunded";
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}

export interface UpdateTransactionInput {
  user_id?: number;
  product_id?: number;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  transaction_type?: "purchase" | "sale" | "return";
  status?: "pending" | "completed" | "cancelled" | "refunded";
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}

export async function listTransactions() {
  const { data } = await api.get<{ success: boolean; message: string; data: TransactionDto[] }>("/transactions");
  return data.data;
}

export async function getTransaction(id: number) {
  const { data } = await api.get<{ success: boolean; message: string; data: TransactionDto }>(`/transactions/${id}`);
  return data.data;
}

export async function listTransactionsByUser(userId: number) {
  const { data } = await api.get<{ success: boolean; message: string; data: TransactionDto[] }>(`/transactions/user/${userId}`);
  return data.data;
}

export async function createTransaction(payload: CreateTransactionInput) {
  const { data } = await api.post<{ success: boolean; message: string; data: TransactionDto }>("/transactions", payload);
  return data.data;
}

export async function updateTransaction(id: number, payload: UpdateTransactionInput) {
  const { data } = await api.put<{ success: boolean; message: string; data: TransactionDto }>(`/transactions/${id}`, payload);
  return data.data;
}

export async function deleteTransaction(id: number) {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/transactions/${id}`);
  return data.success;
} 