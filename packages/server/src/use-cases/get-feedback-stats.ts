import type { FeedbackStatsDto } from "../dtos/feedback.js";
import type { FeedbackRepository } from "../repositories/feedback.interface.js";

export async function getFeedbackStatsUseCase(context: {
  db: FeedbackRepository;
}): Promise<FeedbackStatsDto> {
  const statsArray = await context.db.getFeedbackStats();

  const stats = {
    in_progress: 0,
    planned: 0,
    live: 0,
  };

  statsArray.forEach(({ _id, count }) => {
    stats[_id] = count;
  });

  return stats;
}
