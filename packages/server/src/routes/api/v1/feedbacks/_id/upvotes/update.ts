import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { feedbackResponseSchema } from "../../../../../../validations/feedback.js";
import {
  genericResponseSchema,
  idParamsSchema,
} from "../../../../../../validations/common.js";
import { NotFoundError } from "../../../../../../errors/common.js";
import { upvoteFeedbackUseCase } from "../../../../../../use-cases/upvote-feedback.js";
import { feedbackRepository } from "../../../../../../repositories/feedback.js";
import { toObjectId } from "../../../../../../utils/object-id.js";
import { verifyJWT } from "../../../../../../middleware/auth.js";

const upvoteFeedbackRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/",
    onRequest: [verifyJWT],
    schema: {
      summary: "Toggle Upvote on Feedback",
      description:
        "Allows a user to upvote or remove their upvote from a feedback post. If the user has already voted, their upvote will be removed (toggle behavior).",
      tags: ["Feedback"],
      params: idParamsSchema,
      response: {
        200: feedbackResponseSchema,
        404: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await upvoteFeedbackUseCase(
          { db: feedbackRepository, toObjectId },
          { id: request.params.id, userId: request.user.id },
        );

        return reply.code(200).send(result);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.code(404).send({ message: error.message });
        }
      }
    },
  });
};

export default upvoteFeedbackRoute;
