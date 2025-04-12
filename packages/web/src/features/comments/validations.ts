import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(2, "Comment must be at least 2 characters long")
    .max(250, "Comment must be at most 250 characters long"),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
