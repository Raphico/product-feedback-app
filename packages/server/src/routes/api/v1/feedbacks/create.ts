import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createFeedbackRequestSchema,
  feedbackResponseSchema,
} from "../../../../validations/feedback.js";
import { feedbackRepository } from "../../../../repositories/feedback.js";
import { createFeedbackUseCase } from "../../../../use-cases/create-feedback.js";
import { verifyJWT } from "../../../../middleware/auth.js";

const createFeedbackRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    onRequest: [verifyJWT],
    schema: {
      summary: "Create a product feedback",
      description: "Allows users to submit a feedback for a product",
      tags: ["Feedback"],
      body: createFeedbackRequestSchema,
      response: {
        201: feedbackResponseSchema,
      },
    },
    async handler(request, reply) {
      const result = await createFeedbackUseCase(
        { db: feedbackRepository },
        {
          ...request.body,
          createdBy: request.user.id,
        },
      );

      reply.code(201).send(result);
    },
  });
};

export default createFeedbackRoute;
