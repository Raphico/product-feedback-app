import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginRequestSchema } from "../../../../validations/auth.js";
import { userResponseSchema } from "../../../../validations/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
  comparePassword,
} from "../../../../utils/security.js";
import { userRepository } from "../../../../repositories/user.js";
import { loginUseCase } from "../../../../use-cases/login.js";
import { getCookieOptions } from "../../../../config.js";
import {
  InvalidCredentialsError,
  UnverifiedEmailError,
} from "../../../../errors/auth.js";
import { genericResponseSchema } from "../../../../validations/common.js";

const loginRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/login",
    schema: {
      description: "Authenticates a user and returns access & refresh tokens.",
      summary: "User Login",
      tags: ["Auth"],
      body: loginRequestSchema,
      response: {
        200: userResponseSchema,
        400: genericResponseSchema,
        403: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await loginUseCase(
          {
            db: userRepository,
            comparePassword,
          },
          request.body,
        );

        const accessToken = generateAccessToken({
          id: result.id,
        });
        const refreshToken = generateRefreshToken({ id: result.id });

        const options = getCookieOptions(app.config.env);

        return reply
          .code(200)
          .setCookie("refreshToken", refreshToken, options)
          .setCookie("accessToken", accessToken, options)
          .send({
            id: result.id,
            fullName: result.fullName,
            email: result.email,
            username: result.username,
            avatar: result.avatar,
            role: result.role,
          });
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          return reply.code(400).send({
            message: error.message,
          });
        }

        if (error instanceof UnverifiedEmailError) {
          return reply.code(403).send({
            message: error.message,
          });
        }

        throw error;
      }
    },
  });
};

export default loginRoute;
