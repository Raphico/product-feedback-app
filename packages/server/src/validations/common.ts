import { z } from "zod";

export const genericResponseSchema = z.object({
  message: z.string(),
});
