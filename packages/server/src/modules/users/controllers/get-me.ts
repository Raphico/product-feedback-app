import type { FastifyReply, FastifyRequest } from "fastify";
import { createUserRepository } from "../repository.js";
import { NotFoundError } from "../../../core/exceptions.js";
import { getMeUseCase } from "../use-cases/get-me.js";

export async function getMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const userRepository = createUserRepository(db);

  try {
    const result = await getMeUseCase(
      { db: userRepository },
      { id: request.user.id },
    );

    reply.code(200).send(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}
