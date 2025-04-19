import type { FeedbackRepository } from "../repository.js";
import type { UpdateFeedback } from "../validation.js";
import type { Feedback } from "../../../db/schema.js";
import type { FeedbackResponse } from "../validation.js";
import type { UserRepository } from "../../users/repository.js";
import { ForbiddenError, NotFoundError } from "../../../core/exceptions.js";
import { feedbackToDto } from "../mapper.js";

export async function updateFeedbackUseCase(
  context: {
    db: {
      feedbacks: FeedbackRepository;
      users: UserRepository;
    };
  },
  data: UpdateFeedback & {
    userId: string;
    id: string;
  },
): Promise<FeedbackResponse> {
  const { db } = context;
  const { id, userId, status, ...changes } = data;

  const user = await db.users.findById(userId);
  if (!user) {
    throw new ForbiddenError("User not found");
  }

  const feedback = await db.feedbacks.findById(id);
  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  const isAuthor = feedback.createdBy == user.id;
  const isAdmin = user.role == "admin";

  if (!isAuthor && !isAdmin) {
    throw new ForbiddenError("You are not allowed to update this feedback");
  }

  if (status && !isAdmin) {
    throw new ForbiddenError("Only admins can update a feedback's status");
  }

  if (!isAuthor && isAdmin && Object.keys(changes).length > 0) {
    throw new ForbiddenError("Admins can only update a feedback's status");
  }

  const updatedFeedback = await db.feedbacks.update(id, {
    ...changes,
    status,
  } as Partial<Feedback>);

  return feedbackToDto(updatedFeedback!);
}
