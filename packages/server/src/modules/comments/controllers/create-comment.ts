import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateComment } from "../validations.js";
import { NotFoundError } from "../../../core/exceptions.js";
import { createCommentUseCase } from "../use-cases/create-comment.js";
import { createCommentRepository } from "../repository.js";
import { createFeedbackRepository } from "../../feedbacks/repository.js";

export async function createCommentController(
  request: FastifyRequest<{ Body: CreateComment }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const feedbackRepository = createFeedbackRepository(db);
  const commentRepository = createCommentRepository(db);

  try {
    const result = await createCommentUseCase(
      {
        db: {
          comments: commentRepository,
          feedbacks: feedbackRepository,
        },
      },
      {
        ...request.body,
        createdBy: request.user.id,
      },
    );

    return reply.code(201).send(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}
