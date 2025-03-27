import type {
  FeedbackResponseDto,
  FeedbackResponseWithCommentCountDto,
} from "../dtos/feedback.js";
import type { FeedbackEntity } from "../models/feedback.js";
import { fromObjectId } from "../utils/object-id.js";

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
    id: fromObjectId(feedback._id),
    createdBy: fromObjectId(feedback.createdBy),
    title: feedback.title,
    detail: feedback.detail,
    category: feedback.category,
    status: feedback.status,
    upvotes: feedback.upvotes.map((id) => fromObjectId(id)),
    ...(commentCount !== undefined ? { commentCount } : {}),
  };
}
