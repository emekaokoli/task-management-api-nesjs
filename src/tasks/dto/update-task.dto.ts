import { z } from 'zod';

export const UpdateTaskDto = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  completed: z.boolean().default(false),
});

export type UpdateTaskDtoType = z.infer<typeof UpdateTaskDto>;
