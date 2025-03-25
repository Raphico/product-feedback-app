import type { FeedbackRepository } from "../repositories/feedback.interface.js";
import type { FeedbackCategories } from "../config.js";
import type { FeedbackResponseDto } from "../dtos/feedback.js";
import { feedbackToDto } from "../mappers/feedback.js";

export async function createFeedbackUseCase(
  context: { db: FeedbackRepository },
  data: {
    createdBy: string;
    title: string;
    category: FeedbackCategories;
    detail: string;
  },
): Promise<FeedbackResponseDto> {
  const createdFeedback = await context.db.create(data);
  return feedbackToDto(createdFeedback);
}
