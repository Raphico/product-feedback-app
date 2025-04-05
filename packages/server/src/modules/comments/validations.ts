import { z } from "zod";
import { userResponseSchema } from "../users/validations.js";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(2, "Comment must be at least 2 characters long")
    .max(250, "Comment must be at most 250 characters long"),
  feedbackId: z.string(),
  parentId: z.string().optional(),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

export const createCommentResponseSchema = z.object({
  id: z.string(),
  content: createCommentSchema.shape.content,
  createdBy: z.object({
    id: userResponseSchema.shape.id,
    fullName: userResponseSchema.shape.fullName,
    username: userResponseSchema.shape.username,
    avatar: userResponseSchema.shape.avatar.nullable(),
    role: userResponseSchema.shape.role,
  }),
});

export const commentThreadResponseSchema = z.array(
  z.object({
    id: createCommentResponseSchema.shape.id,
    content: createCommentResponseSchema.shape.content,
    createdBy: createCommentResponseSchema.shape.createdBy,
    replies: createCommentResponseSchema,
  }),
);

export const commentThreadParamsSchema = z.object({
  feedbackId: z.string().regex(/^[a-f\d]{24}$/),
});

export type CommentThreadParamsSchema = z.infer<
  typeof commentThreadParamsSchema
>;
