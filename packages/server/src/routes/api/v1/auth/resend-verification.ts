import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateVerificationCode } from "../../../../utils/security.js";
import { userRepository } from "../../../../repositories/user.js";
import { resendVerificationUseCase } from "../../../../use-cases/resend-verification.js";
import { emailRequestSchema } from "../../../../validations/auth.js";
import { genericResponseSchema } from "../../../../validations/common.js";
import { ConflictError } from "../../../../errors/common.js";

const resendVerificationRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/resend-verification",
    config: {
      rateLimit: {
        max: app.config.rateLimitIntensiveMax,
      },
    },
    schema: {
      description:
        "Resend the email verification code to the user if they haven't verified their email yet.",
      summary: "Resend Email Verification",
      tags: ["Auth"],
      body: emailRequestSchema,
      response: {
        202: genericResponseSchema,
        409: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await resendVerificationUseCase(
          {
            generateVerificationCode,
            sendEmailVerificationCode:
              app.mailService.sendEmailVerificationCode.bind(app.mailService),
            db: userRepository,
          },
          request.body,
        );

        return reply.code(202).send(result);
      } catch (error) {
        if (error instanceof ConflictError) {
          return reply.code(409).send({
            message: error.message,
          });
        }

        throw error;
      }
    },
  });
};

export default resendVerificationRoute;
