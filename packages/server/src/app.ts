import Fastify from "fastify";
import compress from "@fastify/compress";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { randomUUID } from "node:crypto";
import type { Config } from "./config.js";
import type { Logger } from "pino";

type Deps = {
  logger: Logger;
};

export async function initApp(config: Config, deps: Deps) {
  const app = Fastify({
    loggerInstance: deps.logger,
    bodyLimit: config.bodyLimit,
    genReqId: () => randomUUID(),
  });

  app.register(helmet);
  app.register(cors, {
    methods: config.corsMethods,
    origin: config.corsOrigin,
  });
  app.register(compress);
  app.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitTimeWindow,
  });

  await app.after();

  app.route({
    method: "GET",
    url: "/",
    handler(_, reply) {
      reply.send({ foo: "bar" });
    },
  });

  app.setNotFoundHandler(function (request, reply) {
    this.log.warn({ req: request }, "Resource not found");

    reply.code(404);

    return { message: "Not Found" };
  });

  app.setErrorHandler(function (error, _, reply) {
    this.log.error(error);

    reply.code(error.statusCode ?? 500);

    return {
      message: error.message ?? "Something went wrong. Please try again later",
    };
  });

  await app.ready();

  return {
    fastify: app,
    async shutdown() {
      await app.close();
    },
  };
}
