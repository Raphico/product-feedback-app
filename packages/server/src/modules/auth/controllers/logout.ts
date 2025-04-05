import { FastifyReply, FastifyRequest } from "fastify";
import { getCookieOptions } from "../../../config.js";

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const options = getCookieOptions(request.server.config.env);

  return reply
    .code(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .send({
      message: "Logout successful",
    });
}
