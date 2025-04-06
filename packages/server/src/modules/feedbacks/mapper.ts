import { Feedback } from "../../db/schema.js";
import type { FeedbackResponse } from "./validation.js";

export function feedbackToDto(feedback: Feedback): FeedbackResponse {
  return {
    id: feedback.id,
    createdBy: feedback.createdBy,
    title: feedback.title,
    detail: feedback.detail,
    category: feedback.category,
    status: feedback.status,
  };
}
