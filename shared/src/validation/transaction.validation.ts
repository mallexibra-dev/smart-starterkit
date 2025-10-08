import { z } from "zod";

export const createTransactionSchema = z.object({
  user_id: z.number().int().min(1, "User ID is required"),
  product_id: z.number().int().min(1, "Product is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999999, "Quantity is too high"),
  unit_price: z.number().min(0, "Unit price must be non-negative").max(999999999.99, "Unit price is too high"),
  total_price: z.number().min(0, "Total price must be non-negative").max(999999999.99, "Total price is too high"),
  transaction_type: z.enum(["purchase", "sale", "return"], {
    errorMap: () => ({ message: "Transaction type must be purchase, sale, or return" })
  }),
  status: z.enum(["pending", "completed", "cancelled", "refunded"], {
    errorMap: () => ({ message: "Status must be pending, completed, cancelled, or refunded" })
  }).default("pending"),
  payment_method: z.string().max(100, "Payment method is too long").optional(),
  reference_number: z.string().max(100, "Reference number is too long").optional(),
  notes: z.string().max(1000, "Notes are too long").optional(),
});

export const updateTransactionSchema = z.object({
  user_id: z.number().int().min(1, "User ID is required").optional(),
  product_id: z.number().int().min(1, "Product is required").optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999999, "Quantity is too high").optional(),
  unit_price: z.number().min(0, "Unit price must be non-negative").max(999999999.99, "Unit price is too high").optional(),
  total_price: z.number().min(0, "Total price must be non-negative").max(999999999.99, "Total price is too high").optional(),
  transaction_type: z.enum(["purchase", "sale", "return"]).optional(),
  status: z.enum(["pending", "completed", "cancelled", "refunded"]).optional(),
  payment_method: z.string().max(100, "Payment method is too long").optional(),
  reference_number: z.string().max(100, "Reference number is too long").optional(),
  notes: z.string().max(1000, "Notes are too long").optional(),
});

export const transactionFiltersSchema = z.object({
  search: z.string().max(191, "Search term is too long").optional(),
  transaction_type: z.enum(["purchase", "sale", "return"]).optional(),
  status: z.enum(["pending", "completed", "cancelled", "refunded"]).optional(),
  minPrice: z.number().min(0, "Minimum price must be non-negative").optional(),
  maxPrice: z.number().min(0, "Maximum price must be non-negative").optional(),
  minQuantity: z.number().int().min(0, "Minimum quantity must be non-negative").optional(),
  maxQuantity: z.number().int().min(0, "Maximum quantity must be non-negative").optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;