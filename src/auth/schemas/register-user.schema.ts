import { z } from 'zod';
import { Role } from 'src/auth/enums/role.enum';

export const registerUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum([Role.USER, Role.ADMIN]).optional(), 
});


export type RegisterUserDto = z.infer<typeof registerUserSchema>;