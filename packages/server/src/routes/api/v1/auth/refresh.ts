import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { Env } from "../../../../config.js";
import { genericResponseSchema } from "../../../../validations/common.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../../../utils/security.js";

const refreshRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/refresh",
    schema: {
      response: {
        200: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      const refreshToken = request.cookies.refreshToken;
      if (!refreshToken) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        const decoded = verifyToken(
          refreshToken,
          app.config.refreshTokenSecret,
        );

        if (typeof decoded != "object" || !decoded.id) {
          return reply.code(401).send({ message: "Invalid token" });
        }

        const accessToken = generateAccessToken({
          id: request.user!.id,
          email: request.user!.email,
          username: request.user!.username,
          role: request.user!.role,
        });
        const newRefreshToken = generateRefreshToken({ id: request.user!.id });

        const options = {
          path: "/api",
          httpOnly: true,
          secure: app.config.env == Env.Prod,
        };

        return reply
          .code(200)
          .setCookie("refreshToken", newRefreshToken, options)
          .setCookie("accessToken", accessToken, options)
          .send({ message: "Access token refresh successfully" });
      } catch (error) {
        app.log.error(error);
        return reply.code(401).send({ message: "Invalid token" });
      }
    },
  });
};

export default refreshRoute;
