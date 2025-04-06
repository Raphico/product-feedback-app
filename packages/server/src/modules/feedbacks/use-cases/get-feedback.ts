import { NotFoundError } from "../../../core/exceptions.js";
import { FeedbackRepository } from "../repository.js";
import { ExtendedFeedback } from "../validation.js";

export async function getFeedbackUseCase(
  context: {
    db: FeedbackRepository;
  },
  data: { id: string; currentUserId: string },
): Promise<ExtendedFeedback> {
  const { db } = context;
  const { id, currentUserId } = data;

  const feedback = await db.findExtendedById(id, currentUserId);

  if (!feedback) throw new NotFoundError("Feedback not found");

  return feedback;
}
