import {
  InternalServerError,
  NotFoundError,
} from "../../../core/exceptions.js";
import type { FeedbackRepository } from "../../feedbacks/repository.js";
import type { CommentRepository } from "../repository.js";
import { PopulatedComment } from "../types.js";
import { CreateComment } from "../validations.js";

export async function createCommentUseCase(
  context: {
    db: {
      comments: CommentRepository;
      feedbacks: FeedbackRepository;
    };
  },
  data: CreateComment & { createdBy: string },
): Promise<PopulatedComment> {
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
  if (!createdComment) {
    throw new InternalServerError();
  }

  const populatedComment = await db.comments.findById(createdComment.id);

  return populatedComment!;
}
