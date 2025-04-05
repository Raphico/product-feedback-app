import type { FastifyReply, FastifyRequest } from "fastify";
import type { VerificationSchema } from "../validations.js";
import { createUserRepository } from "../../users/repository.js";
import { generateHash } from "../../../core/security.js";
import { ExpiredCodeError, InvalidCodeError } from "../exceptions.js";
import { verificationUseCase } from "../use-cases/verification.js";

export async function verificationController(
  request: FastifyRequest<{ Body: VerificationSchema }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const userRepository = createUserRepository(db);

  try {
    const result = await verificationUseCase(
      {
        db: userRepository,
        generateHash,
      },
      request.body,
    );

    reply.code(200).send(result);
  } catch (error) {
    if (
      error instanceof InvalidCodeError ||
      error instanceof ExpiredCodeError
    ) {
      return reply.code(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
