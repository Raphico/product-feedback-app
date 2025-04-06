import { NotFoundError } from "../../../core/exceptions.js";
import { GenericResponse } from "../../../shared/validation.js";
import { FeedbackRepository } from "../repository.js";

export async function toggleUpvoteUseCase(
  context: {
    db: FeedbackRepository;
  },
  data: { id: string; userId: string },
): Promise<GenericResponse> {
  const { db } = context;
  const { id, userId } = data;

  const feedback = await db.findById(id);
  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  await db.toggleUpvote(id, userId);

  return {
    message: "Upvote toggled successfully",
  };
}
