import type { FastifyReply, FastifyRequest } from "fastify";
import { createFeedbackRepository } from "../repository.js";
import { getStatsUseCase } from "../use-cases/get-stats.js";

export async function getStatsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const feedbackRepository = createFeedbackRepository(db);

  const result = await getStatsUseCase({
    db: feedbackRepository,
  });

  return reply.code(200).send(result);
}
