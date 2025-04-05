import { z } from "zod";

export const genericResponseSchema = z.object({
  message: z.string(),
});

export const idParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/),
});

export type IdParamsSchema = z.infer<typeof idParamsSchema>;
