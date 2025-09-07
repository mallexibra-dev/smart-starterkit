import { z } from 'zod'

export const createUserValidation = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})