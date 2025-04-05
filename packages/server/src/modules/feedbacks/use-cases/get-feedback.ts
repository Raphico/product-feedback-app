import { NotFoundError } from "../../../core/exceptions.js";
import { FeedbackRepository } from "../repository.js";
import { ExtendedFeedbackSchema } from "../validation.js";

export async function getFeedbackUseCase(
  context: {
    db: FeedbackRepository;
  },
  data: { id: string },
): Promise<ExtendedFeedbackSchema> {
  const { db } = context;
  const { id } = data;

  const feedback = await db.findById(id);

  if (!feedback) throw new NotFoundError("Feedback not found");

  return feedback;
}
