import { z } from "zod";
import { userResponseSchema } from "./user.js";

export const commentResponseSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/),
  content: z
    .string()
    .min(2, "Comment must be at least 2 characters long")
    .max(500, "Comment must be at most 500 characters long"),
  createdBy: z.object({
    id: userResponseSchema.shape.id,
    fullName: userResponseSchema.shape.fullName,
    username: userResponseSchema.shape.username,
    avatar: userResponseSchema.shape.avatar.nullable(),
  }),
  feedbackId: z.string().regex(/^[a-f\d]{24}$/),
  parentId: z
    .string()
    .regex(/^[a-f\d]{24}$/)
    .nullable(),
});

export const createCommentRequestSchema = z.object({
  content: commentResponseSchema.shape.content,
  feedbackId: commentResponseSchema.shape.feedbackId,
  parentId: commentResponseSchema.shape.feedbackId.optional(),
});

export const commentsResponseSchema = z.array(commentResponseSchema);

export const commentsRequestParamsSchema = z.object({
  feedbackId: z.string().regex(/^[a-f\d]{24}$/),
});
