import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { getCookieOptions } from "../../../../config.js";
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
      description:
        "Refreshes the user's access token using a valid refresh token stored in cookies.",
      summary: "Refresh Access Token",
      tags: ["Auth"],
      response: {
        200: genericResponseSchema,
        404: genericResponseSchema,
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
          id: request.user.id,
        });
        const newRefreshToken = generateRefreshToken({ id: request.user.id });

        const options = getCookieOptions(app.config.env);

        return reply
          .code(200)
          .setCookie("refreshToken", newRefreshToken, options)
          .setCookie("accessToken", accessToken, options)
          .send({ message: "Access token refreshed successfully" });
      } catch (error) {
        app.log.error(error);
        return reply.code(401).send({ message: "Invalid token" });
      }
    },
  });
};

export default refreshRoute;
