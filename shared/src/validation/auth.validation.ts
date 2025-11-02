import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(191, "Name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(191, "Username is too long")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username can only contain letters, numbers, dots, hyphens, and underscores"),
  email: z.string().email("Invalid email format").max(191, "Email is too long").optional().nullable(),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password is too long"),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Username/email is required").max(191, "Username/email is too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password is too long"),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token cannot be empty").max(1024, "Refresh token is too long").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
