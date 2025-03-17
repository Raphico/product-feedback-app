import Fastify from "fastify";
import compress from "@fastify/compress";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { randomUUID } from "node:crypto";
import type { Config } from "./config.js";
import type { Logger } from "pino";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import type { MailService } from "./services/mail.js";
import { ApiError } from "./utils/error.js";
import autoLoad from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

type Deps = {
  logger: Logger;
  mailService: MailService;
};

declare module "fastify" {
  interface FastifyInstance {
    mailService: MailService;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function initApp(config: Config, deps: Deps) {
  const { logger, mailService } = deps;
  const app = Fastify({
    loggerInstance: logger,
    bodyLimit: config.bodyLimit,
    genReqId: () => randomUUID(),
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

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

  app.decorate("mailService", mailService);

  app.register(autoLoad, {
    dir: join(__dirname, "routes"),
  });

  await app.after();

  app.setNotFoundHandler(function (request, reply) {
    this.log.warn({ req: request }, "Resource not found");

    return reply.code(404).send({ message: "Not found" });
  });

  app.setErrorHandler(function (error, _, reply) {
    this.log.error(error);

    if (error instanceof ApiError) {
      return reply.code(error.status).send({
        message: error.message,
      });
    }

    return reply.code(500).send({
      message: "Something went wrong. Please try again later",
    });
  });

  await app.ready();

  return {
    fastify: app,
    async shutdown() {
      await app.close();
    },
  };
}
