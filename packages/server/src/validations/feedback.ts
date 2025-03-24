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

export const createFeedbackRequestSchema = z.object({
  title: feedbackResponseSchema.shape.title,
  category: feedbackResponseSchema.shape.category,
  detail: feedbackResponseSchema.shape.detail,
});
