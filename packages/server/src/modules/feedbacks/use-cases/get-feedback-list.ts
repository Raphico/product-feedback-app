import type { FeedbackRepository } from "../repository.js";
import type {
  ExtendedFeedbackSchema,
  FeedbackListQuerySchema,
} from "../validation.js";

export async function getFeedbackListUseCase(context: {
  db: FeedbackRepository;
  data: FeedbackListQuerySchema & { currentUserId: string };
}): Promise<ExtendedFeedbackSchema[]> {
  const { sort, currentUserId, ...filter } = context.data;
  const feedbacks = await context.db.findAll({
    sortOption: sort,
    filter,
    currentUserId,
  });

  return feedbacks;
}
