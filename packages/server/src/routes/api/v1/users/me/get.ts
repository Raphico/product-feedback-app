import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { userResponseSchema } from "../../../../../validations/user.js";
import { userRepository } from "../../../../../repositories/user.js";
import { genericResponseSchema } from "../../../../../validations/common.js";
import { NotFoundError } from "../../../../../errors/common.js";
import { getMeUseCase } from "../../../../../use-cases/get-me.js";
import { verifyJWT } from "../../../../../middleware/auth.js";

const getMeRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    onRequest: [verifyJWT],
    schema: {
      description:
        "Fetches the currently authenticated user's profile information.",
      summary: "Get current user details",
      tags: ["User"],
      response: {
        200: userResponseSchema,
        404: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await getMeUseCase(
          { db: userRepository },
          { id: request.user.id },
        );

        reply.code(200).send(result);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.code(404).send({ message: error.message });
        }

        throw error;
      }
    },
  });
};

export default getMeRoute;
