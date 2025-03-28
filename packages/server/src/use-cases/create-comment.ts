import { Types } from "mongoose";
import { CommentResponseDto } from "../dtos/comment.js";
import { commentToDto } from "../mappers/comment.js";
import { CommentRepository } from "../repositories/comment.interface.js";
import { InternalServerError } from "../errors/common.js";

export async function createCommentUseCase(
  context: {
    db: CommentRepository;
    fromObjectId: (id: Types.ObjectId) => string;
  },
  data: {
    createdBy: string;
    content: string;
    feedbackId: string;
    parentId?: string;
  },
): Promise<CommentResponseDto> {
  const createdComment = await context.db.create(data);
  const populatedComment = await context.db.findById(
    context.fromObjectId(createdComment._id),
  );
  if (!populatedComment) {
    throw new InternalServerError();
  }
  return commentToDto(populatedComment);
}
