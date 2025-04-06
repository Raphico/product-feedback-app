import { z } from "zod";

export const genericResponseSchema = z.object({
  message: z.string(),
});

export type GenericResponse = z.infer<typeof genericResponseSchema>;

export const idParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/),
});

export type IdParams = z.infer<typeof idParamsSchema>;
