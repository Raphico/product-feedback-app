import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/security.js";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.accessToken;
  if (!token) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token, request.server.config.accessTokenSecret);

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return reply.code(401).send({ message: "Invalid token" });
    }

    request.user = {
      id: decoded.id,
    };
  } catch (error) {
    request.server.log.error("JWT Verification Error:", error);
    return reply.code(401).send({ message: "Invalid token" });
  }
}
