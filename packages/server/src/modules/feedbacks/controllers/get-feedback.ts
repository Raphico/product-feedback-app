import type { FastifyReply, FastifyRequest } from "fastify";
import type { IdParams } from "../../../shared/validation.js";
import { createFeedbackRepository } from "../repository.js";
import { NotFoundError } from "../../../core/exceptions.js";
import { getFeedbackUseCase } from "../use-cases/get-feedback.js";

export async function getFeedbackController(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const feedbackRepository = createFeedbackRepository(db);

  try {
    const result = await getFeedbackUseCase(
      { db: feedbackRepository },
      { id: request.params.id },
    );

    return reply.code(200).send(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}
