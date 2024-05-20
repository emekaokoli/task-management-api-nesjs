import { z } from 'zod';

export const RegisterDto = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
