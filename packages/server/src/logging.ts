import type { FastifyRequest } from "fastify";
import type { Config } from "./config.js";
import { pino } from "pino";

export function initLogger(config: Config) {
  return pino({
    level: config.logLevel,
    base: {
      env: config.env,
    },
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
      request(request: FastifyRequest) {
        return {
          method: request.method,
          url: request.url.split("?")[0], // Removes query params to keep logs clean and hide sensitive data
          hostname: request.hostname,
          remoteAddress: request.ip,
          remotePort: request.socket.remotePort,
          userAgent: request.headers["user-agent"],
        };
      },
    },
  });
}
