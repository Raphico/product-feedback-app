import type { FeedbackResponse } from "../validation.js";
import type { FeedbackRepository } from "../repository.js";
import type { CreateFeedback } from "../validation.js";
import { feedbackToDto } from "../mapper.js";
import { InternalServerError } from "../../../core/exceptions.js";

export async function createFeedbackUseCase(
  context: { db: FeedbackRepository },
  data: CreateFeedback & { createdBy: string },
): Promise<FeedbackResponse> {
  const createdFeedback = await context.db.create(data);
  if (!createdFeedback) {
    throw new InternalServerError(
      "Something went wrong while creating feedback",
    );
  }
  return feedbackToDto(createdFeedback);
}
