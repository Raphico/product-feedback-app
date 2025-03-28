import { CommentResponseDto } from "../dtos/comment.js";
import { NotFoundError } from "../errors/common.js";
import { commentToDto } from "../mappers/comment.js";
import { CommentRepository } from "../repositories/comment.interface.js";
import { FeedbackRepository } from "../repositories/feedback.interface.js";

export async function getCommentsUseCase(
  context: {
    db: {
      comments: CommentRepository;
      feedbacks: FeedbackRepository;
    };
  },
  data: { feedbackId: string },
): Promise<CommentResponseDto[]> {
  const { db } = context;
  const { feedbackId } = data;

  const feedbackExists = await db.feedbacks.findById(feedbackId);
  if (!feedbackExists) {
    throw new NotFoundError("Feedback not found");
  }

  const comments = await db.comments.findMany(feedbackId);
  return comments.map((comment) => commentToDto(comment));
}
