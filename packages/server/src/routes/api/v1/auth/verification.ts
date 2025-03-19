import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  verifyEmailRequestSchema,
  verifyEmailResponseSchema,
} from "../../../../validations/auth.js";
import { verificationUseCase } from "../../../../use-cases/verification.js";
import { userRepository } from "../../../../repositories/user.js";
import { generateHash } from "../../../../utils/security.js";

const verificationRoute: FastifyPluginAsync = async (app) => {
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
      const result = await verificationUseCase(
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

export default verificationRoute;
