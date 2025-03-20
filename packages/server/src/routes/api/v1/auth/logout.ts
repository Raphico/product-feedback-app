import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { Env } from "../../../../config.js";
import { genericResponseSchema } from "../../../../validations/common.js";

const logoutRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/logout",
    schema: {
      response: {
        200: genericResponseSchema,
      },
    },
    async handler(_, reply) {
      const options = {
        path: "/api",
        httpOnly: true,
        secure: app.config.env == Env.Prod,
      };

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
