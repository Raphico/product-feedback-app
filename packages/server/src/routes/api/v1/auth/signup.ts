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

const signupRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/signup",
    schema: {
      body: signupRequestSchema,
      response: {
        201: userSchema,
      },
    },
    async handler(request, reply) {
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
    },
  });
};

export default signupRoute;
