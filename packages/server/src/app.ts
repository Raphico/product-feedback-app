import Fastify from "fastify";
import compress from "@fastify/compress";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyMultipart from "@fastify/multipart";
import fastifyCookie from "@fastify/cookie";
import { randomUUID } from "node:crypto";
import type { Config } from "./config.js";
import type { Logger } from "pino";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import type { MailService } from "./services/mail.js";
import type { DB } from "./db/index.js";
import { FileUploadService } from "./services/file-upload.js";
import usersRoute from "./modules/users/routes.js";
import feedbacksRoute from "./modules/feedbacks/routes.js";
import commentsRoute from "./modules/comments/routes.js";
import authRoute from "./modules/auth/routes.js";

type Deps = {
  logger: Logger;
  mailService: MailService;
  fileUploadService: FileUploadService;
  db: DB;
};

export interface UserPayload {
  id: string;
}

declare module "fastify" {
  interface FastifyInstance {
    mailService: MailService;
    fileUploadService: FileUploadService;
    config: Config;
    db: DB;
  }

  interface FastifyRequest {
    user: UserPayload;
  }
}

export async function initApp(config: Config, deps: Deps) {
  const { logger, mailService, fileUploadService, db } = deps;
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
  app.register(fastifyMultipart);
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
    methods: config.corsMethods.split(","),
    origin: config.corsOrigin.split(","),
    credentials: true,
  });
  app.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitTimeWindow,
  });

  app.decorate("mailService", mailService);
  app.decorate("fileUploadService", fileUploadService);
  app.decorate("config", config);
  app.decorate("db", db);

  app.register(authRoute, { prefix: "/api/v1/auth" });
  app.register(usersRoute, { prefix: "/api/v1/users" });
  app.register(feedbacksRoute, { prefix: "/api/v1/feedbacks" });
  app.register(commentsRoute, { prefix: "/api/v1/comments" });

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
