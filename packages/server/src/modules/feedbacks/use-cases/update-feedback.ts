import type { FeedbackRepository } from "../repository.js";
import type { UpdateFeedbackSchema } from "../validation.js";
import type { FeedbackResponseDto } from "../dto.js";
import { ForbiddenError, NotFoundError } from "../../../core/exceptions.js";
import { feedbackToDto } from "../mapper.js";

export async function updateFeedbackUseCase(
  context: {
    db: FeedbackRepository;
  },
  data: UpdateFeedbackSchema & {
    userId: string;
    id: string;
  },
): Promise<FeedbackResponseDto> {
  const { db } = context;
  const { id, userId, ...changes } = data;

  const feedback = await db.findById(id);

  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  if (feedback.createdBy != userId) {
    throw new ForbiddenError("You are not allowed to update this feedback");
  }

  const updatedFeedback = await db.update(id, changes);

  if (!updatedFeedback) {
    throw new NotFoundError("Feedback not found");
  }

  return feedbackToDto(updatedFeedback);
}
