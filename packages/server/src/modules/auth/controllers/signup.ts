import type { FastifyReply, FastifyRequest } from "fastify";
import type { SignupRequest } from "../validations.js";
import {
  generateVerificationCode,
  hashPassword,
} from "../../../core/security.js";
import { ConflictError } from "../../../core/exceptions.js";
import { createUserRepository } from "../../users/repository.js";
import { signupUseCase } from "../use-cases/signup.js";

export async function signupController(
  request: FastifyRequest<{ Body: SignupRequest }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const mailService = request.server.mailService;
  const userRepository = createUserRepository(db);

  try {
    const result = await signupUseCase(
      {
        hashPassword,
        generateVerificationCode,
        sendEmailVerificationCode:
          mailService.sendEmailVerificationCode.bind(mailService),
        db: userRepository,
      },
      request.body,
    );

    return reply.code(201).send(result);
  } catch (error) {
    if (error instanceof ConflictError) {
      return reply.code(409).send({
        message: error.message,
      });
    }

    throw error;
  }
}
