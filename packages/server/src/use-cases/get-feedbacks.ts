import type { FeedbackResponseWithCommentCountDto } from "../dtos/feedback.js";
import type { FeedbackEntity } from "../models/feedback.js";
import type { FeedbackRepository } from "../repositories/feedback.interface.js";
import { feedbackToDto } from "../mappers/feedback.js";
import { FeedbacksQuerySchema } from "../validations/feedback.js";

export async function getFeedbacksUseCase(context: {
  db: FeedbackRepository;
  query: FeedbacksQuerySchema;
}): Promise<FeedbackResponseWithCommentCountDto[]> {
  const { sort, ...filter } = context.query;
  const feedbacks = await context.db.findMany(sort, filter);
  return feedbacks.map((feedback) => {
    const { commentCount, ...rest } = feedback;
    return feedbackToDto(rest as FeedbackEntity, commentCount);
  });
}
