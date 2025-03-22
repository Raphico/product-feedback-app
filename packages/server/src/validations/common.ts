import { z } from "zod";

export const genericResponseSchema = z.object({
  message: z.string(),
});

export const idParamsSchema = z.object({
  id: z.string(),
});
