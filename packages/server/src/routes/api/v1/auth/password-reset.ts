import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateVerificationToken } from "../../../../utils/security.js";
import { userRepository } from "../../../../repositories/user.js";
import { passwordResetUseCase } from "../../../../use-cases/password-reset.js";
import {
  emailRequestSchema,
  emailResponseSchema,
} from "../../../../validations/auth.js";

const passwordResetRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/password-reset",
    config: {
      rateLimit: {
        max: app.config.rateLimitIntensiveMax,
      },
    },
    schema: {
      body: emailRequestSchema,
      response: {
        200: emailResponseSchema,
      },
    },
    async handler(request, reply) {
      const result = await passwordResetUseCase(
        {
          generateVerificationToken,
          sendPasswordResetLink: app.mailService.sendPasswordResetLink.bind(
            app.mailService,
          ),
          db: userRepository,
        },
        {
          ...request.body,
          url: app.config.clientForgotPasswordRedirectUrl,
        },
      );
      return reply.code(200).send(result);
    },
  });
};

export default passwordResetRoute;
