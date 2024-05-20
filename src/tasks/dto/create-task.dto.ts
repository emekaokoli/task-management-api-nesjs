import { z } from 'zod';

export const CreateTaskDto = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export type CreateTaskDtoType = z.infer<typeof CreateTaskDto>;
