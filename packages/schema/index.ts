import { z } from 'zod';

// Template Element Schema
export const TemplateElementSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'rect']),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  style: z.record(z.any()).optional(),
  content: z.string().optional(), // For text
  src: z.string().optional(),     // For image
});

export const TemplateSchema = z.object({
  width: z.number(),
  height: z.number(),
  elements: z.array(TemplateElementSchema),
});

export type Template = z.infer<typeof TemplateSchema>;
export type TemplateElement = z.infer<typeof TemplateElementSchema>;

// Job Input Schema
export const JobInputSchema = z.object({
  templateId: z.string(),
  data: z.record(z.string()), // Replacement data like { headline: "...", image: "..." }
  formats: z.array(z.string()).default(['post']),
});

export type JobInput = z.infer<typeof JobInputSchema>;
