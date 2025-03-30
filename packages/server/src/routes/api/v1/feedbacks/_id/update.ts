import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  feedbackResponseSchema,
  updateFeedbackRequestSchema,
} from "../../../../../validations/feedback.js";
import {
  genericResponseSchema,
  idParamsSchema,
} from "../../../../../validations/common.js";
import { updateFeedbackUseCase } from "../../../../../use-cases/update-feedback.js";
import { feedbackRepository } from "../../../../../repositories/feedback.js";
import { ForbiddenError, NotFoundError } from "../../../../../errors/common.js";
import { fromObjectId } from "../../../../../utils/object-id.js";
import { verifyJWT } from "../../../../../middleware/auth.js";

const updateFeedbackRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/",
    onRequest: [verifyJWT],
    schema: {
      summary: "Update Feedback",
      description:
        "Allow users to update feedback details, including title, category, detail, and status",
      tags: ["Feedback"],
      body: updateFeedbackRequestSchema,
      params: idParamsSchema,
      response: {
        200: feedbackResponseSchema,
        404: genericResponseSchema,
        403: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await updateFeedbackUseCase(
          { db: feedbackRepository, fromObjectId },
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
    },
  });
};

export default updateFeedbackRoute;
