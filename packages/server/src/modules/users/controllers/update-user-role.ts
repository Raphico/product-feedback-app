import type { FastifyReply, FastifyRequest } from "fastify";
import type { IdParamsSchema } from "../../../shared/validation.js";
import { createUserRepository } from "../repository.js";
import { updateUserRoleSchema } from "../validations.js";
import { ForbiddenError, NotFoundError } from "../../../core/exceptions.js";
import { updateUserRoleUseCase } from "../use-cases/update-user-role.js";

export async function updateUserRoleController(
  request: FastifyRequest<{
    Body: updateUserRoleSchema;
    Params: IdParamsSchema;
  }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const userRepository = createUserRepository(db);

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
}
