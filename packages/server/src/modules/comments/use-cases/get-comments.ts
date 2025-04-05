import { NotFoundError } from "../../../core/exceptions.js";
import type { FeedbackRepository } from "../../feedbacks/repository.js";
import type { CommentRepository } from "../repository.js";
import type { ThreadedComment } from "../types.js";

export async function getCommentsUseCase(
  context: {
    db: {
      comments: CommentRepository;
      feedbacks: FeedbackRepository;
    };
  },
  data: { feedbackId: string },
): Promise<ThreadedComment[]> {
  const { db } = context;
  const { feedbackId } = data;

  const feedback = await db.feedbacks.findById(feedbackId);

  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  return db.comments.findNestedByFeedbackId(data.feedbackId);
}
