import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { getCookieOptions } from "../../../../config.js";
import { genericResponseSchema } from "../../../../validations/common.js";

const logoutRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/logout",
    schema: {
      description: "Logs out the user by clearing authentication cookies.",
      summary: "User Logout",
      tags: ["Auth"],
      response: {
        200: genericResponseSchema,
      },
    },
    async handler(_, reply) {
      const options = getCookieOptions(app.config.env);

      return reply
        .code(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .send({
          message: "Logout successful",
        });
    },
  });
};

export default logoutRoute;
