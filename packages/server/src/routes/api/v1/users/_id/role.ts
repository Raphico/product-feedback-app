import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  updateUserRoleSchema,
  userSchema,
} from "../../../../../validations/user.js";
import {
  genericResponseSchema,
  idParamsSchema,
} from "../../../../../validations/common.js";
import { updateUserRoleUseCase } from "../../../../../use-cases/update-user-role.js";
import { userRepository } from "../../../../../repositories/user.js";
import { NotFoundError, ForbiddenError } from "../../../../../errors/common.js";

const updateUserRoleRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/role",
    schema: {
      tags: ["User"],
      params: idParamsSchema,
      body: updateUserRoleSchema,
      response: {
        200: userSchema,
        404: genericResponseSchema,
        403: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const result = await updateUserRoleUseCase(
          { db: userRepository },
          {
            currentUserId: request.user.id,
            targetUserId: request.params.id,
            newRole: request.body.role,
          },
        );

        return reply.code(200).send(result);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.code(404).send({ message: error.message });
        }

        if (error instanceof ForbiddenError) {
          return reply.code(403).send({ message: error.message });
        }

        throw error;
      }
    },
  });
};

export default updateUserRoleRoute;
