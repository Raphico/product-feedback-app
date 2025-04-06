import type { FastifyReply, FastifyRequest } from "fastify";
import type { IdParams } from "../../../shared/validation.js";
import { ForbiddenError, NotFoundError } from "../../../core/exceptions.js";
import { createFeedbackRepository } from "../repository.js";
import { deleteFeedbackUseCase } from "../use-cases/delete-feedback.js";

export async function deleteFeedbackController(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const feedbackRepository = createFeedbackRepository(db);

  try {
    const result = await deleteFeedbackUseCase(
      { db: feedbackRepository },
      { id: request.params.id, userId: request.user.id },
    );

    return reply.code(200).send(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply.code(404).send({ message: error.message });
    }

    if (error instanceof ForbiddenError) {
      return reply.code(403).send({ message: error.message });
    }

    throw error;
  }
}
