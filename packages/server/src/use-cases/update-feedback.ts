import type { Types } from "mongoose";
import type { FeedbackRepository } from "../repositories/feedback.interface.js";
import type { FeedbackResponseDto } from "../dtos/feedback.js";
import { ForbiddenError, NotFoundError } from "../errors/common.js";
import { feedbackToDto } from "../mappers/feedback.js";

export async function updateFeedbackUseCase(
  context: {
    db: FeedbackRepository;
    fromObjectId: (id: Types.ObjectId) => string;
  },
  data: {
    userId: string;
    id: string;
    [key: string]: string | undefined;
  },
): Promise<FeedbackResponseDto> {
  const { db, fromObjectId } = context;
  const { id, userId, ...changes } = data;

  const feedback = await db.findById(id);

  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  if (fromObjectId(feedback.createdBy) != userId) {
    throw new ForbiddenError("You are not allowed to update this feedback");
  }

  const updatedFeedback = await db.update(id, { ...changes });

  if (!updatedFeedback) {
    throw new NotFoundError("Feedback not found");
  }

  return feedbackToDto(updatedFeedback);
}
