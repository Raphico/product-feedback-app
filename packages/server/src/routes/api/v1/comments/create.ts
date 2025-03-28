import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  commentResponseSchema,
  createCommentRequestSchema,
} from "../../../../validations/comment.js";
import { genericResponseSchema } from "../../../../validations/common.js";
import { NotFoundError } from "../../../../errors/common.js";
import { createCommentUseCase } from "../../../../use-cases/create-comment.js";
import { commentRepository } from "../../../../repositories/comment.js";
import { fromObjectId } from "../../../../utils/object-id.js";
import { feedbackRepository } from "../../../../repositories/feedback.js";

const createCommentRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      summary: "Add a comment",
      description: "Allows users to add a comment to a feedback for a product",
      tags: ["Comment"],
      body: createCommentRequestSchema,
      response: {
        201: commentResponseSchema,
        404: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await createCommentUseCase(
          {
            db: {
              comments: commentRepository,
              feedbacks: feedbackRepository,
            },
            fromObjectId,
          },
          {
            content: request.body.content,
            feedbackId: request.body.feedbackId,
            createdBy: request.user.id,
            ...(request.body?.parentId && { parentId: request.body.parentId }),
          },
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

export default createCommentRoute;
