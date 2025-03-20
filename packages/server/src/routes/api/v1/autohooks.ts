import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../../../utils/security.js";
import type { UserPayload } from "../../../app.js";

export default async function (app: FastifyInstance) {
  app.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (
        request.url.startsWith("/api/v1/auth") &&
        !["/api/v1/auth/logout", "/api/v1/auth/refresh"].includes(request.url)
      ) {
        return;
      }

      const token = request.cookies.accessToken;
      if (!token) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        const decoded = verifyToken(token, app.config.accessTokenSecret);

        if (
          !decoded ||
          typeof decoded !== "object" ||
          !decoded.id ||
          !decoded.username ||
          !decoded.email ||
          !decoded.role
        ) {
          return reply.code(401).send({ message: "Invalid token" });
        }

        request.user = decoded as UserPayload;
      } catch (error) {
        app.log.error("JWT Verification Error:", error);
        return reply.code(401).send({ message: "Invalid token" });
      }
    },
  );
}
