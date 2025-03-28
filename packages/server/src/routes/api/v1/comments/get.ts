import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  commentsRequestParamsSchema,
  commentsResponseSchema,
} from "../../../../validations/comment.js";
import { getCommentsUseCase } from "../../../../use-cases/get-comments.js";
import { commentRepository } from "../../../../repositories/comment.js";
import { feedbackRepository } from "../../../../repositories/feedback.js";
import { genericResponseSchema } from "../../../../validations/common.js";
import { NotFoundError } from "../../../../errors/common.js";

const getCommentsRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      summary: "Retrieve comments",
      description: "Fetches all comments associated with a specific feedback.",
      tags: ["Comment"],
      querystring: commentsRequestParamsSchema,
      response: {
        200: commentsResponseSchema,
        404: genericResponseSchema,
      },
    },
    async handler(request, reply) {
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

        console.log(result);
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

export default getCommentsRoute;
