import {
  FeedbackResponseDto,
  FeedbackResponseWithCommentCountDto,
} from "../dtos/feedback.js";
import { FeedbackEntity } from "../models/feedback.js";

export function feedbackToDto(feedback: FeedbackEntity): FeedbackResponseDto;
export function feedbackToDto(
  feedback: FeedbackEntity,
  commentCount: number,
): FeedbackResponseWithCommentCountDto;
export function feedbackToDto(
  feedback: FeedbackEntity,
  commentCount?: number,
): FeedbackResponseDto | FeedbackResponseWithCommentCountDto {
  return {
    id: feedback._id.toString(),
    createdBy: feedback.createdBy.toString(),
    title: feedback.title,
    detail: feedback.detail,
    category: feedback.category,
    status: feedback.status,
    upvotes: feedback.upvotes,
    ...(commentCount !== undefined ? { commentCount } : {}),
  };
}
