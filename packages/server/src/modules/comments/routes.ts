import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  commentThreadParamsSchema,
  commentThreadResponseSchema,
  createCommentResponseSchema,
  createCommentSchema,
} from "./validations.js";
import { genericResponseSchema } from "../../shared/validation.js";
import { getCommentsController } from "./controllers/get-comments.js";
import { verifyJWT } from "../../hooks/auth.js";
import { createCommentController } from "./controllers/create-comment.js";

const commentsRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      summary: "Retrieve comments",
      description: "Fetches all comments associated with a specific feedback.",
      tags: ["Comment"],
      querystring: commentThreadParamsSchema,
      response: {
        200: commentThreadResponseSchema,
        404: genericResponseSchema,
      },
    },
    handler: getCommentsController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    preValidation: [verifyJWT],
    schema: {
      summary: "Add a comment",
      description: "Allows users to add a comment to a feedback for a product",
      tags: ["Comment"],
      body: createCommentSchema,
      response: {
        201: createCommentResponseSchema,
        404: genericResponseSchema,
      },
    },
    handler: createCommentController,
  });
};

export default commentsRoute;
