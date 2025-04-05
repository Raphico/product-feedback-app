import type { FeedbackRepository } from "../repository.js";
import type { FeedbackStatsSchema } from "../validation.js";

export async function getStatsUseCase(context: {
  db: FeedbackRepository;
}): Promise<FeedbackStatsSchema> {
  const stats = await context.db.computeStats();
  return stats;
}
