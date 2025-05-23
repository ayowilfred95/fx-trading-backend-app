import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


export type LoginUserDto = z.infer<typeof loginUserSchema>;