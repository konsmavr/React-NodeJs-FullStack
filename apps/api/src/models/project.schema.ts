import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(8),
  status: z.enum(['PLANNED', 'ACTIVE', 'DONE']).default('PLANNED')
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
