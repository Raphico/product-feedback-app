import { z } from "zod";
import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_STATUSES,
  FeedbackSortOptions,
} from "../../config.js";

export const feedbackResponseSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/),
  createdBy: z.string().regex(/^[a-f\d]{24}$/),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(75, "Title must be at most 75 characters long"),
  category: z.enum(FEEDBACK_CATEGORIES),
  detail: z
    .string()
    .min(10, "Detail must be at least 10 characters long")
    .max(250, "Detail must be at most 250 characters long"),
  status: z.enum(FEEDBACK_STATUSES),
});

export const extendedFeedbackSchema = feedbackResponseSchema.extend({
  commentCount: z.number(),
  upvoteCount: z.number(),
  hasUpvote: z.boolean(),
});

export type ExtendedFeedbackSchema = z.infer<typeof extendedFeedbackSchema>;

export const createFeedbackSchema = z.object({
  title: feedbackResponseSchema.shape.title,
  category: feedbackResponseSchema.shape.category,
  detail: feedbackResponseSchema.shape.detail,
});

export type CreateFeedbackSchema = z.infer<typeof createFeedbackSchema>;

export const feedbackListResponseSchema = z.array(extendedFeedbackSchema);

export const feedbackListQuerySchema = z.object({
  category: feedbackResponseSchema.shape.category,
  status: feedbackResponseSchema.shape.status,
  sort: z
    .nativeEnum(FeedbackSortOptions)
    .default(FeedbackSortOptions.MOST_UPVOTES),
});

export type FeedbackListQuerySchema = z.infer<typeof feedbackListQuerySchema>;

export const updateFeedbackSchema = z.object({
  title: feedbackResponseSchema.shape.title,
  category: feedbackResponseSchema.shape.category,
  detail: feedbackResponseSchema.shape.detail,
  status: feedbackResponseSchema.shape.status,
});

export type UpdateFeedbackSchema = z.infer<typeof updateFeedbackSchema>;

export const feedbackStatsSchema = z.object({
  inProgress: z.number(),
  planned: z.number(),
  live: z.number(),
});

export type FeedbackStatsSchema = z.infer<typeof feedbackStatsSchema>;
