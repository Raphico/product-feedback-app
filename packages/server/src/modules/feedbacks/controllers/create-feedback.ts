import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateFeedbackSchema } from "../validation.js";
import { createFeedbackRepository } from "../repository.js";
import { createFeedbackUseCase } from "../use-cases/create-feedback.js";

export async function createFeedbackController(
  request: FastifyRequest<{ Body: CreateFeedbackSchema }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const feedbackRepository = createFeedbackRepository(db);

  const result = await createFeedbackUseCase(
    { db: feedbackRepository },
    {
      ...request.body,
      createdBy: request.user.id,
    },
  );

  reply.code(201).send(result);
}
