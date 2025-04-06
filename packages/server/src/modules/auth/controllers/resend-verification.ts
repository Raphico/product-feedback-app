import { FastifyReply, FastifyRequest } from "fastify";
import { createUserRepository } from "../../users/repository.js";
import { generateVerificationCode } from "../../../core/security.js";
import { ConflictError } from "../../../core/exceptions.js";
import { resendVerificationUseCase } from "../use-cases/resend-verification.js";
import { EmailRequest } from "../validations.js";

export async function resendVerificationController(
  request: FastifyRequest<{ Body: EmailRequest }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const mailService = request.server.mailService;
  const userRepository = createUserRepository(db);

  try {
    const result = await resendVerificationUseCase(
      {
        generateVerificationCode,
        sendEmailVerificationCode:
          mailService.sendEmailVerificationCode.bind(mailService),
        db: userRepository,
      },
      request.body,
    );

    return reply.code(202).send(result);
  } catch (error) {
    if (error instanceof ConflictError) {
      return reply.code(409).send({
        message: error.message,
      });
    }

    throw error;
  }
}
