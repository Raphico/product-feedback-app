import type { FeedbackRepository } from "../repository.js";
import type { FeedbackStats } from "../validation.js";

export async function getStatsUseCase(context: {
  db: FeedbackRepository;
}): Promise<FeedbackStats> {
  const stats = await context.db.computeStats();
  return stats;
}
