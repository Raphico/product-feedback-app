import type { FastifyReply, FastifyRequest } from "fastify";
import type { UpdateFeedback } from "../validation.js";
import type { IdParams } from "../../../shared/validation.js";
import { ForbiddenError, NotFoundError } from "../../../core/exceptions.js";
import { createFeedbackRepository } from "../repository.js";
import { updateFeedbackUseCase } from "../use-cases/update-feedback.js";
import { createUserRepository } from "../../users/repository.js";

export async function updateFeedbackController(
  request: FastifyRequest<{
    Body: UpdateFeedback;
    Params: IdParams;
  }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const feedbackRepository = createFeedbackRepository(db);
  const userRepository = createUserRepository(db);

  try {
    const result = await updateFeedbackUseCase(
      {
        db: {
          feedbacks: feedbackRepository,
          users: userRepository,
        },
      },
      { id: request.params.id, userId: request.user.id, ...request.body },
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
