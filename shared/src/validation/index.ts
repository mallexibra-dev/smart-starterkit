// Add your Zod validation schemas here as needed for your application
// Example:
// import { z } from 'zod';
//
// export const createUserSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
// });
//
// export type CreateUserInput = z.infer<typeof createUserSchema>;