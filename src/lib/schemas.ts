import { z } from 'zod';

export const contactSchema = z.object({
  category: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.email().max(200),
  phone: z.string().trim().min(6).max(40),
  detail: z.string().trim().min(1).max(4000),
  agree: z.literal(true),
  locale: z.enum(['ja']).default('ja'),
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
