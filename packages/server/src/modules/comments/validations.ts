import { z } from "zod";
import { userResponseSchema } from "../users/validations.js";
import { ThreadedComment } from "./types.js";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(2, "Comment must be at least 2 characters long")
    .max(250, "Comment must be at most 250 characters long"),
  feedbackId: z.string(),
  parentId: z.string().optional(),
});

export type CreateComment = z.infer<typeof createCommentSchema>;

export const createCommentResponseSchema = z.object({
  id: z.string(),
  content: createCommentSchema.shape.content,
  feedbackId: z.string(),
  parentId: z.string().nullable(),
  createdBy: z.object({
    id: userResponseSchema.shape.id,
    fullName: userResponseSchema.shape.fullName,
    username: userResponseSchema.shape.username,
    avatar: userResponseSchema.shape.avatar.nullable(),
    role: userResponseSchema.shape.role,
  }),
});

export const commentThreadSchema: z.ZodType<ThreadedComment[]> = z.lazy(() =>
  z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      feedbackId: z.string(),
      createdBy: createCommentResponseSchema.shape.createdBy,
      replies: commentThreadSchema,
    }),
  ),
);

export const commentThreadResponseSchema = z.object({
  comments: commentThreadSchema,
  total: z.number(),
});

export type CommentThreadResponse = z.infer<typeof commentThreadResponseSchema>;

export const commentThreadParamsSchema = z.object({
  feedbackId: z.string(),
});

export type CommentThreadParams = z.infer<typeof commentThreadParamsSchema>;
