import type { FastifyReply, FastifyRequest } from "fastify";
import type { CommentThreadParamsSchema } from "../validations.js";
import { NotFoundError } from "../../../core/exceptions.js";
import { getCommentsUseCase } from "../use-cases/get-comments.js";
import { createFeedbackRepository } from "../../feedbacks/repository.js";
import { createCommentRepository } from "../repository.js";

export async function getCommentsController(
  request: FastifyRequest<{ Querystring: CommentThreadParamsSchema }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const feedbackRepository = createFeedbackRepository(db);
  const commentRepository = createCommentRepository(db);

  try {
    const result = await getCommentsUseCase(
      {
        db: {
          comments: commentRepository,
          feedbacks: feedbackRepository,
        },
      },
      { feedbackId: request.query.feedbackId },
    );

    return reply.code(200).send(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}
