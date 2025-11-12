import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(191, "Name is too long"),
  email: z.string().email("Invalid email format").max(191, "Email is too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(255, "Password is too long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(191, "Email is too long"),
  password: z.string().min(1, "Password is required").max(255, "Password is too long"),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token cannot be empty").max(1024, "Refresh token is too long").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
