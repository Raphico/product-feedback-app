import { FeedbackResponseDto } from "../dtos/feedback.js";
import { ForbiddenError, NotFoundError } from "../errors/common.js";
import { feedbackToDto } from "../mappers/feedback.js";
import { FeedbackRepository } from "../repositories/feedback.interface.js";

export async function updateFeedbackUseCase(
  context: {
    db: FeedbackRepository;
  },
  data: {
    userId: string;
    id: string;
    [key: string]: string | undefined;
  },
): Promise<FeedbackResponseDto> {
  const { db } = context;
  const { id, userId, ...changes } = data;

  const feedback = await db.findById(id);

  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  if (feedback.createdBy.toString() != userId) {
    throw new ForbiddenError("You are not allowed to update this feedback");
  }

  const updatedFeedback = await db.update(id, { ...changes });

  if (!updatedFeedback) {
    throw new NotFoundError("Feedback not found");
  }

  return feedbackToDto(updatedFeedback);
}
