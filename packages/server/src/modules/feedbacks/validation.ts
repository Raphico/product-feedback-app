import { z } from "zod";
import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_STATUSES,
  FeedbackSortOptions,
} from "../../config.js";

export const feedbackResponseSchema = z.object({
  id: z.string(),
  createdBy: z.string(),
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

export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;

export const extendedFeedbackSchema = feedbackResponseSchema.extend({
  commentCount: z.number({ coerce: true }),
  upvoteCount: z.number({ coerce: true }),
  hasUpvote: z.boolean(),
});

export type ExtendedFeedback = z.infer<typeof extendedFeedbackSchema>;

export const createFeedbackSchema = z.object({
  title: feedbackResponseSchema.shape.title,
  category: feedbackResponseSchema.shape.category,
  detail: feedbackResponseSchema.shape.detail,
});

export type CreateFeedback = z.infer<typeof createFeedbackSchema>;

export const feedbackListResponseSchema = z.array(extendedFeedbackSchema);

export const feedbackListQuerySchema = z.object({
  category: feedbackResponseSchema.shape.category.optional(),
  status: feedbackResponseSchema.shape.status.optional(),
  sort: z
    .nativeEnum(FeedbackSortOptions)
    .default(FeedbackSortOptions.MOST_UPVOTES),
});

export type FeedbackListQuery = z.infer<typeof feedbackListQuerySchema>;

export const updateFeedbackSchema = z
  .object({
    title: feedbackResponseSchema.shape.title.optional(),
    category: feedbackResponseSchema.shape.category.optional(),
    detail: feedbackResponseSchema.shape.detail.optional(),
    status: feedbackResponseSchema.shape.status.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateFeedback = z.infer<typeof updateFeedbackSchema>;

export const feedbackStatsSchema = z.object({
  inProgress: z.number(),
  planned: z.number(),
  live: z.number(),
});

export type FeedbackStats = z.infer<typeof feedbackStatsSchema>;
