import type { FeedbackRepository } from "../repository.js";
import type { FeedbackResponseDto } from "../dto.js";
import { ForbiddenError, NotFoundError } from "../../../core/exceptions.js";
import { feedbackToDto } from "../mapper.js";

export async function deleteFeedbackUseCase(
  context: {
    db: FeedbackRepository;
  },
  data: { id: string; userId: string },
): Promise<FeedbackResponseDto> {
  const { db } = context;
  const { id, userId } = data;

  const feedback = await db.findById(id);
  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  if (feedback.createdBy != userId) {
    throw new ForbiddenError("You are not allowed to delete this feedback");
  }

  const updatedFeedback = await db.update(id, { deletedAt: new Date() });
  if (!updatedFeedback) throw new NotFoundError("Feedback not found");

  return feedbackToDto(updatedFeedback);
}
