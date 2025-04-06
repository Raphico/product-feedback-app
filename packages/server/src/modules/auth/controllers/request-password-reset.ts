import type { FastifyReply, FastifyRequest } from "fastify";
import type { EmailRequest } from "../validations.js";
import { createUserRepository } from "../../users/repository.js";
import { generateVerificationToken } from "../../../core/security.js";
import { requestPasswordResetUseCase } from "../use-cases/request-password-reset.js";

export async function requestPasswordResetController(
  request: FastifyRequest<{ Body: EmailRequest }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const config = request.server.config;
  const mailService = request.server.mailService;
  const userRepository = createUserRepository(db);

  const result = await requestPasswordResetUseCase(
    {
      generateVerificationToken,
      sendPasswordResetLink:
        mailService.sendPasswordResetLink.bind(mailService),
      db: userRepository,
      url: config.clientForgotPasswordRedirectUrl,
    },
    request.body,
  );

  return reply.code(200).send(result);
}
