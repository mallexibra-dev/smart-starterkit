import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(191, "Product name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  price: z.number().min(0, "Price must be non-negative").max(999999999.99, "Price is too high"),
  stock: z.number().int().min(0, "Stock must be non-negative").max(999999, "Stock is too high"),
  category: z.string().max(100, "Category is too long").optional(),
  sku: z.string().max(100, "SKU is too long").optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(191, "Product name is too long").optional(),
  description: z.string().max(1000, "Description is too long").optional(),
  price: z.number().min(0, "Price must be non-negative").max(999999999.99, "Price is too high").optional(),
  stock: z.number().int().min(0, "Stock must be non-negative").max(999999, "Stock is too high").optional(),
  category: z.string().max(100, "Category is too long").optional(),
  sku: z.string().max(100, "SKU is too long").optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const productFiltersSchema = z.object({
  search: z.string().max(191, "Search term is too long").optional(),
  category: z.string().max(100, "Category filter is too long").optional(),
  status: z.enum(["active", "inactive"]).optional(),
  minPrice: z.number().min(0, "Minimum price must be non-negative").optional(),
  maxPrice: z.number().min(0, "Maximum price must be non-negative").optional(),
  minStock: z.number().int().min(0, "Minimum stock must be non-negative").optional(),
  maxStock: z.number().int().min(0, "Maximum stock must be non-negative").optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;