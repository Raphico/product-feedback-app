import type { FastifyReply, FastifyRequest } from "fastify";
import { createUserRepository } from "../../users/repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../../core/security.js";
import { getCookieOptions } from "../../../config.js";

export async function refreshController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const config = request.server.config;
  const userRepository = createUserRepository(db);

  const refreshToken = request.cookies.refreshToken;
  if (!refreshToken) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(refreshToken, config.refreshTokenSecret);

    if (
      typeof decoded != "object" ||
      !decoded.id ||
      typeof decoded.id != "string"
    ) {
      return reply.code(401).send({ message: "Invalid token" });
    }

    const user = await userRepository.findById(decoded?.id);

    if (!user) {
      return reply.code(401).send({ message: "Invalid token" });
    }

    const accessToken = generateAccessToken({
      id: user.id,
    });
    const newRefreshToken = generateRefreshToken({ id: user.id });

    const options = getCookieOptions(config.env);

    return reply
      .code(200)
      .setCookie("refreshToken", newRefreshToken, options)
      .setCookie("accessToken", accessToken, options)
      .send({ message: "Access token refreshed successfully" });
  } catch (error) {
    request.server.log.error(error);
    return reply.code(401).send({ message: "Invalid token" });
  }
}
