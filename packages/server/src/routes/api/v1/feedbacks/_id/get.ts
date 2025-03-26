import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { feedbackResponseWithCommentCountSchema } from "../../../../../validations/feedback.js";
import {
  genericResponseSchema,
  idParamsSchema,
} from "../../../../../validations/common.js";
import { feedbackRepository } from "../../../../../repositories/feedback.js";
import { NotFoundError } from "../../../../../errors/common.js";
import { getFeedbackUseCase } from "../../../../../use-cases/get-feedback.js";

const getFeedbackRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      summary: "Get Feedback",
      description: "Allow users to get a feedback by id",
      tags: ["Feedback"],
      params: idParamsSchema,
      response: {
        200: feedbackResponseWithCommentCountSchema,
        404: genericResponseSchema,
      },
    },
    async handler(request, reply) {
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
    },
  });
};

export default getFeedbackRoute;
