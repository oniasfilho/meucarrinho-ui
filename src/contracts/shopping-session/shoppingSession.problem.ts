import { z } from "zod";

export const ProblemDetailSchema = z
  .object({
    type: z.string().optional(),
    title: z.string().optional(),
    status: z.number().optional(),
    detail: z.string().optional(),
    instance: z.string().optional(),
    errors: z.record(z.string(), z.string()).optional(),
  })
  .passthrough();

export type ProblemDetail = z.infer<typeof ProblemDetailSchema>;
