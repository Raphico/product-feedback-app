import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { feedbackStatsSchema } from "../../../../../validations/feedback.js";
import { feedbackRepository } from "../../../../../repositories/feedback.js";
import { getFeedbackStatsUseCase } from "../../../../../use-cases/get-feedback-stats.js";

const getFeedbackStatsRoute: FastifyPluginAsync = async (app) => {
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
    async handler(_, reply) {
      const result = await getFeedbackStatsUseCase({
        db: feedbackRepository,
      });

      return reply.code(200).send(result);
    },
  });
};

export default getFeedbackStatsRoute;
