import type { FeedbackResponseWithCommentCountDto } from "../dtos/feedback.js";
import type { FeedbackRepository } from "../repositories/feedback.interface.js";
import { NotFoundError } from "../errors/common.js";
import { feedbackToDto } from "../mappers/feedback.js";

export async function getFeedbackUseCase(
  context: {
    db: FeedbackRepository;
  },
  data: { id: string },
): Promise<FeedbackResponseWithCommentCountDto> {
  const { db } = context;
  const { id } = data;

  const feedback = await db.findById(id);

  if (!feedback) throw new NotFoundError("Feedback not found");

  const commentCount = await db.getFeedbackCommentCount(
    feedback._id.toString(),
  );
  return feedbackToDto(feedback, commentCount);
}
