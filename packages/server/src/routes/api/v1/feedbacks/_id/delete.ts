import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { feedbackResponseSchema } from "../../../../../validations/feedback.js";
import {
  genericResponseSchema,
  idParamsSchema,
} from "../../../../../validations/common.js";
import { feedbackRepository } from "../../../../../repositories/feedback.js";
import { ForbiddenError, NotFoundError } from "../../../../../errors/common.js";
import { fromObjectId } from "../../../../../utils/object-id.js";
import { deleteFeedbackUseCase } from "../../../../../use-cases/delete-feedback.js";

const deleteFeedbackRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/",
    schema: {
      summary: "Soft Delete Feedback",
      description: "Marks feedback as deleted without permanent removal.",
      tags: ["Feedback"],
      params: idParamsSchema,
      response: {
        200: feedbackResponseSchema,
        404: genericResponseSchema,
        403: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await deleteFeedbackUseCase(
          { db: feedbackRepository, fromObjectId },
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
    },
  });
};

export default deleteFeedbackRoute;
