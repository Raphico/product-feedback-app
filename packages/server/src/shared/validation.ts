import { z } from "zod";

export const genericResponseSchema = z.object({
  message: z.string(),
});

export type GenericResponse = z.infer<typeof genericResponseSchema>;

export const idParamsSchema = z.object({
  id: z.string(),
});

export type IdParams = z.infer<typeof idParamsSchema>;
