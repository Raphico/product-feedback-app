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

const passwordResetRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/password-reset/:token",
    schema: {
      params: passwordResetParamsSchema,
      body: passwordResetRequestSchema,
      response: {
        200: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      const result = await passwordResetUseCase(
        {
          generateHash,
          hashPassword,
          db: userRepository,
        },
        {
          ...request.body,
          token: request.params.token,
        },
      );
      return reply.code(200).send(result);
    },
  });
};

export default passwordResetRoute;
