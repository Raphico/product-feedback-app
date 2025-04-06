import type { FastifyReply, FastifyRequest } from "fastify";
import type { FeedbackListQuery } from "../validation.js";
import { createFeedbackRepository } from "../repository.js";
import { getFeedbackListUseCase } from "../use-cases/get-feedback-list.js";

export async function getFeedbackListController(
  request: FastifyRequest<{ Querystring: FeedbackListQuery }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const feedbackRepository = createFeedbackRepository(db);

  const result = await getFeedbackListUseCase({
    db: feedbackRepository,
    data: { ...request.query, currentUserId: request.user.id },
  });

  return reply.code(200).send(result);
}
