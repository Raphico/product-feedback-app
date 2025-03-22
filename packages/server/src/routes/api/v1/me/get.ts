import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userSchema } from "../../../../validations/user.js";
import { userRepository } from "../../../../repositories/user.js";
import { genericResponseSchema } from "../../../../validations/common.js";

const getMeRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      description:
        "Fetches the currently authenticated user's profile information.",
      summary: "Get current user details",
      tags: ["Me"],
      response: {
        200: userSchema,
        404: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      const user = await userRepository.findById(request.user.id);

      if (!user) return reply.code(404).send({ message: "User not found" });

      return reply.code(200).send({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      });
    },
  });
};

export default getMeRoute;
