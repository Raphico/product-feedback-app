import { Types } from "mongoose";
import { CommentResponseDto } from "../dtos/comment.js";
import { commentToDto } from "../mappers/comment.js";
import { CommentRepository } from "../repositories/comment.interface.js";
import { InternalServerError, NotFoundError } from "../errors/common.js";
import { FeedbackRepository } from "../repositories/feedback.interface.js";

export async function createCommentUseCase(
  context: {
    db: {
      comments: CommentRepository;
      feedbacks: FeedbackRepository;
    };
    fromObjectId: (id: Types.ObjectId) => string;
  },
  data: {
    createdBy: string;
    content: string;
    feedbackId: string;
    parentId?: string;
  },
): Promise<CommentResponseDto> {
  const { db } = context;

  const feedbackExists = await db.feedbacks.findById(data.feedbackId);
  if (!feedbackExists) {
    throw new NotFoundError("Feedback not found");
  }

  if (data.parentId) {
    const parentCommentExists = await db.comments.findById(data.parentId);
    if (!parentCommentExists) {
      throw new NotFoundError("Parent comment not found");
    }
  }

  const createdComment = await db.comments.create(data);
  const populatedComment = await db.comments.findById(
    context.fromObjectId(createdComment._id),
  );
  if (!populatedComment) {
    throw new InternalServerError();
  }
  return commentToDto(populatedComment);
}
