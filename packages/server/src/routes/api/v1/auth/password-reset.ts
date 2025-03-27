import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { hashPassword, generateHash } from "../../../../utils/security.js";
import { userRepository } from "../../../../repositories/user.js";
import { genericResponseSchema } from "../../../../validations/common.js";
import {
  passwordResetParamsSchema,
  passwordResetRequestSchema,
} from "../../../../validations/auth.js";
import { passwordResetUseCase } from "../../../../use-cases/password-reset.js";
import {
  ExpiredTokenError,
  InvalidTokenError,
} from "../../../../errors/auth.js";
import { fromObjectId } from "../../../../utils/object-id.js";

const passwordResetRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/password-reset/:token",
    schema: {
      description: "Allows a user to reset their password using a reset token.",
      summary: "Password Reset",
      tags: ["Auth"],
      params: passwordResetParamsSchema,
      body: passwordResetRequestSchema,
      response: {
        200: genericResponseSchema,
        400: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await passwordResetUseCase(
          {
            generateHash,
            hashPassword,
            db: userRepository,
            fromObjectId,
          },
          {
            ...request.body,
            token: request.params.token,
          },
        );
        return reply.code(200).send(result);
      } catch (error) {
        if (
          error instanceof InvalidTokenError ||
          error instanceof ExpiredTokenError
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

export default passwordResetRoute;
