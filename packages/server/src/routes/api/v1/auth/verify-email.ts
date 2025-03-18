import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  verifyEmailRequestSchema,
  verifyEmailResponseSchema,
} from "../../../../validations/auth.js";
import { verifyEmailUseCase } from "../../../../use-cases/verify-email.js";
import { userRepository } from "../../../../repositories/user.js";
import { generateHash } from "../../../../utils/security.js";

const verifyEmailRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/verification",
    schema: {
      body: verifyEmailRequestSchema,
      response: {
        200: verifyEmailResponseSchema,
      },
    },
    async handler(request, reply) {
      const result = await verifyEmailUseCase(
        {
          db: userRepository,
          generateHash,
        },
        request.body,
      );

      reply.code(200).send(result);
    },
  });
};

export default verifyEmailRoute;
