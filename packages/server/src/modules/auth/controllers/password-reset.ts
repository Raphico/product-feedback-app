import type {
  PasswordResetParams,
  PasswordResetRequest,
} from "../validations.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ExpiredTokenError, InvalidTokenError } from "../exceptions.js";
import { generateHash, hashPassword } from "../../../core/security.js";
import { createUserRepository } from "../../users/repository.js";
import { passwordResetUseCase } from "../use-cases/password-reset.js";

export async function passwordResetController(
  request: FastifyRequest<{
    Body: PasswordResetRequest;
    Params: PasswordResetParams;
  }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const userRepository = createUserRepository(db);

  try {
    const result = await passwordResetUseCase(
      {
        generateHash,
        hashPassword,
        db: userRepository,
      },
      {
        ...request.body,
        token: request.params.token,
      },
    );
    return reply.code(200).send(result);
  } catch (error) {
    if (
      error instanceof InvalidTokenError ||
      error instanceof ExpiredTokenError
    ) {
      return reply.code(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
