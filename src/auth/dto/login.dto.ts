import { z } from 'zod';

export const LoginDto = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDtoType = z.infer<typeof LoginDto>;
