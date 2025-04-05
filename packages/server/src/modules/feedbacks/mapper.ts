import { Feedback } from "../../db/schema.js";
import type {
  ExtendedFeedbackResponseDto,
  FeedbackResponseDto,
} from "./dto.js";
import { ExtendedFeedbackSchema } from "./validation.js";

export function feedbackToDto(feedback: Feedback): FeedbackResponseDto {
  return {
    id: feedback.id,
    createdBy: feedback.createdBy,
    title: feedback.title,
    detail: feedback.detail,
    category: feedback.category,
    status: feedback.status,
  };
}

export function extendedFeedbackToDto(
  feedback: ExtendedFeedbackSchema,
): ExtendedFeedbackResponseDto {
  return {
    id: feedback.id,
    createdBy: feedback.createdBy,
    title: feedback.title,
    detail: feedback.detail,
    category: feedback.category,
    status: feedback.status,
    upvoteCount: feedback.upvoteCount,
    commentCount: feedback.commentCount,
    hasUpvote: feedback.hasUpvote,
  };
}
