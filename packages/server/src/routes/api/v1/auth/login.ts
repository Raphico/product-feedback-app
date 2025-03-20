import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginRequestSchema } from "../../../../validations/auth.js";
import { userSchema } from "../../../../validations/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
  comparePassword,
} from "../../../../utils/security.js";
import { userRepository } from "../../../../repositories/user.js";
import { loginUseCase } from "../../../../use-cases/login.js";
import { Env } from "../../../../config.js";

const signupRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/login",
    schema: {
      body: loginRequestSchema,
      response: {
        200: userSchema,
      },
    },
    async handler(request, reply) {
      const result = await loginUseCase(
        {
          db: userRepository,
          comparePassword,
          generateAccessToken,
          generateRefreshToken,
        },
        request.body,
      );

      const options = {
        path: "/api",
        httpOnly: true,
        secure: app.config.env == Env.Prod,
      };

      return reply
        .code(200)
        .setCookie("refreshToken", result.refreshToken, options)
        .setCookie("accessToken", result.accessToken, options)
        .send({
          id: result.id,
          fullName: result.fullName,
          email: result.email,
          username: result.username,
          avatar: result.avatar,
          isEmailVerified: result.isEmailVerified,
          role: result.role,
        });
    },
  });
};

export default signupRoute;
