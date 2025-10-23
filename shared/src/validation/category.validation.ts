import { z } from "zod";

// Base schema for category validation
export const categoryBaseSchema = z.object({
  name: z.string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Category name can only contain letters, numbers, spaces, hyphens, and underscores"),

  slug: z.string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9\-_]+$/, "Slug can only contain lowercase letters, numbers, hyphens, and underscores")
    .transform(val => val.toLowerCase().trim()),

  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),

  icon: z.string()
    .max(50, "Icon name must be less than 50 characters")
    .optional(),

  color: z.string()
    .max(20, "Color name must be less than 20 characters")
    .regex(/^[a-z]+$/, "Color must be a valid color name")
    .optional(),

  sort_order: z.coerce
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be 0 or greater")
    .default(0),

  status: z.enum(["active", "inactive"], {
    message: "Status must be either active or inactive"
  }).default("active")
});

// Schema for creating categories
export const createCategorySchema = categoryBaseSchema.transform((data) => {
  // Convert empty strings to undefined for optional fields
  return {
    ...data,
    description: data.description || undefined,
    icon: data.icon || undefined,
    color: data.color || undefined,
  };
});

// Schema for updating categories (all fields optional)
export const updateCategorySchema = categoryBaseSchema.partial().extend({
  id: z.number().positive("Category ID must be a positive number")
}).transform((data) => {
  // Convert empty strings to undefined for optional fields
  const result: any = { ...data };
  if (result.description === "") result.description = undefined;
  if (result.icon === "") result.icon = undefined;
  if (result.color === "") result.color = undefined;
  return result;
});

// Schema for category list query parameters
export const categoryListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["active", "inactive", "all"]).default("all"),
  sort_by: z.enum(["name", "sort_order", "created_at"]).default("sort_order"),
  sort_order: z.enum(["asc", "desc"]).default("asc")
});

// Export types
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;