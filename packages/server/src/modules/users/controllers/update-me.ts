import type { FastifyReply, FastifyRequest } from "fastify";
import type { UpdateUserSchema } from "../validations.js";
import { NotFoundError } from "../../../core/exceptions.js";
import { createUserRepository } from "../repository.js";
import { updateMeUseCase } from "../use-cases/update-me.js";

export async function updateMeController(
  request: FastifyRequest<{ Body: UpdateUserSchema }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const userRepository = createUserRepository(db);

  try {
    const result = await updateMeUseCase(
      { db: userRepository },
      {
        id: request.user.id,
        ...request.body,
      },
    );

    return reply.code(200).send(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}
