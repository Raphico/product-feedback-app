import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { genericResponseSchema } from "../../../../validations/common.js";
import {
  feedbacksQuerySchema,
  feedbacksResponseSchema,
} from "../../../../validations/feedback.js";
import { getFeedbacksUseCase } from "../../../../use-cases/get-feedbacks.js";
import { feedbackRepository } from "../../../../repositories/feedback.js";

const getFeedbacksRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      summary: "Retrieve Feedbacks",
      description:
        "Fetches all feedbacks with optional filters for status and category.",
      tags: ["Feedback"],
      querystring: feedbacksQuerySchema,
      response: {
        200: feedbacksResponseSchema,
        404: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      const result = await getFeedbacksUseCase({
        db: feedbackRepository,
        query: request.query,
      });

      return reply.code(200).send(result);
    },
  });
};

export default getFeedbacksRoute;
