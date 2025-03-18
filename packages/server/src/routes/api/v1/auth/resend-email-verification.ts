import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateVerificationCode } from "../../../../utils/security.js";
import { userRepository } from "../../../../repositories/user.js";
import { resendEmailVerificationUseCase } from "../../../../use-cases/resend-email-verification.js";
import {
  emailRequestSchema,
  emailResponseSchema,
} from "../../../../validations/auth.js";

const resendEmailVerificationRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/resend-verification",
    config: {
      rateLimit: {
        max: app.config.rateLimitIntensiveMax,
      },
    },
    schema: {
      body: emailRequestSchema,
      response: {
        202: emailResponseSchema,
      },
    },
    async handler(request, reply) {
      const result = await resendEmailVerificationUseCase(
        {
          generateVerificationCode,
          sendEmailVerificationCode:
            app.mailService.sendEmailVerificationCode.bind(app.mailService),
          db: userRepository,
        },
        request.body,
      );
      return reply.code(201).send(result);
    },
  });
};

export default resendEmailVerificationRoute;
