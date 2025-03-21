import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { signupRequestSchema } from "../../../../validations/auth.js";
import { userSchema } from "../../../../validations/user.js";
import { signupUseCase } from "../../../../use-cases/signup.js";
import {
  hashPassword,
  generateVerificationCode,
} from "../../../../utils/security.js";
import { userRepository } from "../../../../repositories/user.js";
import { ConflictError } from "../../../../errors/common.js";
import { genericResponseSchema } from "../../../../validations/common.js";

const signupRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/signup",
    config: {
      rateLimit: {
        max: app.config.rateLimitIntensiveMax,
      },
    },
    schema: {
      description:
        "Creates a new user account. Sends an email verification code upon successful signup.",
      summary: "User Signup",
      tags: ["Auth"],
      body: signupRequestSchema,
      response: {
        201: userSchema,
        409: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await signupUseCase(
          {
            hashPassword,
            generateVerificationCode,
            sendEmailVerificationCode:
              app.mailService.sendEmailVerificationCode.bind(app.mailService),
            db: userRepository,
          },
          request.body,
        );

        return reply.code(201).send(result);
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

export default signupRoute;
