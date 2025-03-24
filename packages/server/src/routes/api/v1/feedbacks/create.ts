import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createFeedbackRequestSchema,
  feedbackResponseSchema,
} from "../../../../validations/feedback.js";
import { feedbackRepository } from "../../../../repositories/feedback.js";

const createFeedbackRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
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
      const createdFeedback = await feedbackRepository.create({
        ...request.body,
        createdBy: request.user.id,
      });

      reply.code(201).send(createdFeedback);
    },
  });
};

export default createFeedbackRoute;
