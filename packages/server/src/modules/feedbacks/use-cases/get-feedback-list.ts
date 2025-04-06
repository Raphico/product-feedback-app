import type { FeedbackRepository } from "../repository.js";
import type { ExtendedFeedback, FeedbackListQuery } from "../validation.js";

export async function getFeedbackListUseCase(context: {
  db: FeedbackRepository;
  data: FeedbackListQuery & { currentUserId: string };
}): Promise<ExtendedFeedback[]> {
  const { sort, currentUserId, ...filter } = context.data;
  const feedbacks = await context.db.findAll({
    sortOption: sort,
    filter,
    currentUserId,
  });

  return feedbacks;
}
