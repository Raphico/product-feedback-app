import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateVerificationToken } from "../../../../utils/security.js";
import { userRepository } from "../../../../repositories/user.js";
import { requestPasswordResetUseCase } from "../../../../use-cases/request-password-reset.js";
import { emailRequestSchema } from "../../../../validations/auth.js";
import { genericResponseSchema } from "../../../../validations/common.js";

const requestPasswordResetRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/request-password-reset",
    config: {
      rateLimit: {
        max: app.config.rateLimitIntensiveMax,
      },
    },
    schema: {
      body: emailRequestSchema,
      response: {
        200: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      const result = await requestPasswordResetUseCase(
        {
          generateVerificationToken,
          sendPasswordResetLink: app.mailService.sendPasswordResetLink.bind(
            app.mailService,
          ),
          db: userRepository,
          url: app.config.clientForgotPasswordRedirectUrl,
        },
        request.body,
      );
      return reply.code(200).send(result);
    },
  });
};

export default requestPasswordResetRoute;
