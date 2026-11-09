import { z } from 'zod';
export const registerSchema = z.object({
  name: z.string().min(2).max(255).trim(),
  email: z.email().min(5).max(255).toLowerCase(),
  role: z.enum(['user', 'admin']).default('user'),
  password: z.string().min(8).max(64),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(8),
});
