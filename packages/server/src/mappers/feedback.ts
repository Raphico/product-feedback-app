import { FeedbackResponseDto } from "../dtos/feedback.js";
import { FeedbackEntity } from "../models/feedback.js";

export function feedbackToDto(feedback: FeedbackEntity): FeedbackResponseDto {
  return {
    id: feedback._id.toString(),
    createdBy: feedback.createdBy.toString(),
    title: feedback.title,
    detail: feedback.detail,
    category: feedback.category,
    status: feedback.status,
    upvotes: feedback.upvotes,
  };
}
