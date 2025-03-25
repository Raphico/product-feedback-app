import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyEmailRequestSchema } from "../../../../validations/auth.js";
import { verificationUseCase } from "../../../../use-cases/verification.js";
import { userRepository } from "../../../../repositories/user.js";
import { generateHash } from "../../../../utils/security.js";
import { ExpiredCodeError, InvalidCodeError } from "../../../../errors/auth.js";
import { genericResponseSchema } from "../../../../validations/common.js";

const verificationRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/verification",
    schema: {
      description:
        "Verifies a user's email using a one-time verification code.",
      summary: "Verify Email",
      tags: ["Auth"],
      body: verifyEmailRequestSchema,
      response: {
        200: genericResponseSchema,
        400: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await verificationUseCase(
          {
            db: userRepository,
            generateHash,
          },
          request.body,
        );

        reply.code(200).send(result);
      } catch (error) {
        if (
          error instanceof InvalidCodeError ||
          error instanceof ExpiredCodeError
        ) {
          return reply.code(400).send({
            message: error.message,
          });
        }

        throw error;
      }
    },
  });
};

export default verificationRoute;
