import Fastify from "fastify";
import compress from "@fastify/compress";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCookie from "@fastify/cookie";
import { randomUUID } from "node:crypto";
import type { Config, Roles } from "./config.js";
import type { Logger } from "pino";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import type { MailService } from "./services/mail.js";
import autoLoad from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

type Deps = {
  logger: Logger;
  mailService: MailService;
};

export interface UserPayload {
  id: string;
  username: string;
  email: string;
  role: Roles;
}

declare module "fastify" {
  interface FastifyInstance {
    mailService: MailService;
    config: Config;
  }

  interface FastifyRequest {
    user: UserPayload;
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
  app.register(fastifyCookie);
  app.register(compress);
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: config.serviceName,
        description: config.serviceDescription,
        version: config.serviceVersion,
      },
    },
    transform: jsonSchemaTransform,
  });
  app.register(fastifySwaggerUI, {
    routePrefix: config.swaggerUIPath,
  });
  app.register(cors, {
    methods: config.corsMethods,
    origin: config.corsOrigin,
  });
  app.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitTimeWindow,
  });

  app.decorate("mailService", mailService);
  app.decorate("config", config);

  app.register(autoLoad, {
    dir: join(__dirname, "routes"),
    autoHooks: true,
    cascadeHooks: true,
  });

  await app.after();

  app.setNotFoundHandler(function (request, reply) {
    this.log.warn({ req: request }, "Resource not found");

    return reply.code(404).send({ message: "Not found" });
  });

  app.setErrorHandler(function (error, _, reply) {
    this.log.error(error);

    return reply.code(error?.statusCode ?? 500).send({
      message: error.message,
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
