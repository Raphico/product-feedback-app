import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { updateUserSchema, userSchema } from "../../../../validations/user.js";
import { userRepository } from "../../../../repositories/user.js";
import { genericResponseSchema } from "../../../../validations/common.js";

const updateMeRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/",
    schema: {
      description:
        "Updates the currently authenticated user's profile information.",
      summary: "Update current user details",
      tags: ["Me"],
      body: updateUserSchema,
      response: {
        200: userSchema,
        404: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      const updatedUser = await userRepository.update(
        request.user.id,
        request.body,
      );

      if (!updatedUser) {
        return reply.code(404).send({ message: "User not found" });
      }

      return reply.code(200).send({
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      });
    },
  });
};

export default updateMeRoute;
