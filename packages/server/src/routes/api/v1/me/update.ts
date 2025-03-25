import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  updateUserSchema,
  userResponseSchema,
} from "../../../../validations/user.js";
import { userRepository } from "../../../../repositories/user.js";
import { genericResponseSchema } from "../../../../validations/common.js";
import { updateMeUseCase } from "../../../../use-cases/update-me.js";
import { NotFoundError } from "../../../../errors/common.js";

const updateMeRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/",
    schema: {
      description:
        "Updates the currently authenticated user's profile information.",
      summary: "Update current user details",
      tags: ["Me"],
      body: updateUserSchema,
      response: {
        200: userResponseSchema,
        404: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await updateMeUseCase(
          { db: userRepository },
          {
            id: request.user.id,
            ...request.body,
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

export default updateMeRoute;
