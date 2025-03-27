import { Types } from "mongoose";
import { FeedbackResponseDto } from "../dtos/feedback.js";
import { ForbiddenError, NotFoundError } from "../errors/common.js";
import { feedbackToDto } from "../mappers/feedback.js";
import { FeedbackRepository } from "../repositories/feedback.interface.js";

export async function deleteFeedbackUseCase(
  context: {
    db: FeedbackRepository;
    fromObjectId: (id: Types.ObjectId) => string;
  },
  data: { id: string; userId: string },
): Promise<FeedbackResponseDto> {
  const { db, fromObjectId } = context;
  const { id, userId } = data;

  const feedback = await db.findById(id);
  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  if (fromObjectId(feedback.createdBy) != userId) {
    throw new ForbiddenError("You are not allowed to delete this feedback");
  }

  const updatedFeedback = await db.update(id, { deletedAt: new Date() });
  if (!updatedFeedback) throw new NotFoundError("Feedback not found");

  return feedbackToDto(updatedFeedback);
}
