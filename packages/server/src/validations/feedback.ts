import { z } from "zod";
import { FeedbackCategories, FeedbackStatuses } from "../config.js";

export const feedbackResponseSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/),
  createdBy: z.string().regex(/^[a-f\d]{24}$/),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters long"),
  category: z.nativeEnum(FeedbackCategories),
  detail: z
    .string()
    .min(10, "Detail must be at least 10 characters long")
    .max(1000, "Detail must be at most 1000 characters long"),
  status: z.nativeEnum(FeedbackStatuses),
  upvotes: z.array(z.string().regex(/^[a-f\d]{24}$/)).default([]),
});

export const feedbackResponseWithCommentCountSchema =
  feedbackResponseSchema.extend({
    commentCount: z.number(),
  });

export const createFeedbackRequestSchema = z.object({
  title: feedbackResponseSchema.shape.title,
  category: feedbackResponseSchema.shape.category,
  detail: feedbackResponseSchema.shape.detail,
});

export const feedbacksResponseSchema = z.array(
  feedbackResponseWithCommentCountSchema,
);

export const feedbacksQuerySchema = z.object({
  category: feedbackResponseSchema.shape.category.optional(),
  status: feedbackResponseSchema.shape.status.optional(),
});

export type FeedbacksQuerySchema = z.infer<typeof feedbacksQuerySchema>;

export const updateFeedbackRequestSchema = z
  .object({
    title: feedbackResponseSchema.shape.title.optional(),
    category: feedbackResponseSchema.shape.category.optional(),
    detail: feedbackResponseSchema.shape.detail.optional(),
    status: feedbackResponseSchema.shape.status.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    ),
  );

export const feedbackStatsSchema = z.object({
  in_progress: z.number(),
  planned: z.number(),
  live: z.number(),
});
