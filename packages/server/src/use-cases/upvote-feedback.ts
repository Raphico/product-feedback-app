import type { FeedbackResponseDto } from "../dtos/feedback.js";
import type { FeedbackRepository } from "../repositories/feedback.interface.js";
import { NotFoundError } from "../errors/common.js";
import { feedbackToDto } from "../mappers/feedback.js";
import { Types } from "mongoose";

export async function upvoteFeedbackUseCase(
  context: {
    db: FeedbackRepository;
    toObjectId: (id: string) => Types.ObjectId;
  },
  data: { id: string; userId: string },
): Promise<FeedbackResponseDto> {
  const { db, toObjectId } = context;
  const { id, userId } = data;

  const feedback = await db.findById(id);
  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  const alreadyVoted = feedback.upvotes.includes(toObjectId(userId));

  const updatedFeedback = await db.updateUpvote(id, alreadyVoted, userId);
  if (!updatedFeedback) {
    throw new NotFoundError("Feedback not found");
  }

  return feedbackToDto(updatedFeedback);
}
