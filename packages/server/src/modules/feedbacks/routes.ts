import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createFeedbackSchema,
  extendedFeedbackSchema,
  feedbackListQuerySchema,
  feedbackListResponseSchema,
  feedbackResponseSchema,
  feedbackStatsSchema,
  updateFeedbackSchema,
} from "./validation.js";
import { createFeedbackController } from "./controllers/create-feedback.js";
import { verifyJWT } from "../../hooks/auth.js";
import {
  genericResponseSchema,
  idParamsSchema,
} from "../../shared/validation.js";
import { getFeedbackListController } from "./controllers/get-feedback-list.js";
import { getFeedbackController } from "./controllers/get-feedback.js";
import { updateFeedbackController } from "./controllers/update-feedback.js";
import { deleteFeedbackController } from "./controllers/delete-feedback.js";
import { toggleUpvoteController } from "./controllers/toggle-upvote.js";
import { getStatsController } from "./controllers/get-stats.js";

const feedbacksRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    onRequest: [verifyJWT],
    schema: {
      summary: "Create a product feedback",
      description: "Allows users to submit a feedback for a product",
      tags: ["Feedback"],
      body: createFeedbackSchema,
      response: {
        201: feedbackResponseSchema,
      },
    },
    handler: createFeedbackController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      summary: "Retrieve Feedbacks",
      description:
        "Fetches all feedbacks with optional filters for status and category.",
      tags: ["Feedback"],
      querystring: feedbackListQuerySchema,
      response: {
        200: feedbackListResponseSchema,
        404: genericResponseSchema,
      },
    },
    handler: getFeedbackListController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      summary: "Get Feedback",
      description: "Allow users to get a feedback by id",
      tags: ["Feedback"],
      params: idParamsSchema,
      response: {
        200: extendedFeedbackSchema,
        404: genericResponseSchema,
      },
    },
    handler: getFeedbackController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/",
    onRequest: [verifyJWT],
    schema: {
      summary: "Update Feedback",
      description:
        "Allow users to update feedback details, including title, category, detail, and status",
      tags: ["Feedback"],
      body: updateFeedbackSchema,
      params: idParamsSchema,
      response: {
        200: feedbackResponseSchema,
        404: genericResponseSchema,
        403: genericResponseSchema,
      },
    },
    handler: updateFeedbackController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/",
    onRequest: [verifyJWT],
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
    handler: deleteFeedbackController,
  });

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
    handler: toggleUpvoteController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      description: "Retrieves total planned, in progress, and live feedbacks",
      summary: "Retrieve Feedback stats",
      tags: ["Feedback"],
      response: {
        200: feedbackStatsSchema,
      },
    },
    handler: getStatsController,
  });
};

export default feedbacksRoute;
