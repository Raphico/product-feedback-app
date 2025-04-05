import { FastifyReply, FastifyRequest } from "fastify";
import { IdParamsSchema } from "../../../shared/validation.js";
import { NotFoundError } from "../../../core/exceptions.js";
import { createFeedbackRepository } from "../repository.js";
import { toggleUpvoteUseCase } from "../use-cases/toggle-upvote.js";

export async function toggleUpvoteController(
  request: FastifyRequest<{ Params: IdParamsSchema }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const feedbackRepository = createFeedbackRepository(db);

  try {
    const result = await toggleUpvoteUseCase(
      { db: feedbackRepository },
      { id: request.params.id, userId: request.user.id },
    );

    return reply.code(200).send(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply.code(404).send({ message: error.message });
    }
  }
}
