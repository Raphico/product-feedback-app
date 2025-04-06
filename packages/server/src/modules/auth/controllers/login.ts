import type { FastifyReply, FastifyRequest } from "fastify";
import type { LoginRequest } from "../validations.js";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../../../core/security.js";
import { createUserRepository } from "../../users/repository.js";
import { getCookieOptions } from "../../../config.js";
import {
  InvalidCredentialsError,
  UnverifiedEmailError,
} from "../exceptions.js";
import { loginUseCase } from "../use-cases/login.js";

export async function loginController(
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const userRepository = createUserRepository(db);

  try {
    const result = await loginUseCase(
      {
        db: userRepository,
        comparePassword,
      },
      request.body,
    );

    const accessToken = generateAccessToken({
      id: result.id,
    });
    const refreshToken = generateRefreshToken({ id: result.id });

    const options = getCookieOptions(request.server.config.env);

    return reply
      .code(200)
      .setCookie("refreshToken", refreshToken, options)
      .setCookie("accessToken", accessToken, options)
      .send(result);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.code(400).send({
        message: error.message,
      });
    }

    if (error instanceof UnverifiedEmailError) {
      return reply.code(403).send({
        message: error.message,
      });
    }

    throw error;
  }
}
