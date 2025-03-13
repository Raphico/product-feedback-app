import { z } from "zod";
import parseDuration from "parse-duration";
import parseBytes from "bytes";

export enum Env {
  Dev = "development",
  Prod = "production",
  Test = "test",
}

function getEnv() {
  switch (process.env.NODE_ENV?.toLowerCase()) {
    case "production":
      return Env.Prod;
    case "development":
      return Env.Dev;
    case "test":
      return Env.Test;
    default:
      return Env.Dev;
  }
}

const logLevels = ["fatal", "error", "warn", "info", "debug", "trace"] as const;

const configSchema = z.object({
  env: z
    .nativeEnum(Env)
    .default(Env.Dev)
    .describe("the current environment mode of the application"),
  port: z.coerce
    .number({ coerce: true })
    .describe("port on which the server listens for incoming HTTP requests"),
  bodyLimit: z
    .number()
    .describe(
      "the maximum request payload in bytes the server is allowed to accept",
    ),
  rateLimitTimeWindow: z
    .number({ coerce: true })
    .describe("the time window in millisecond for rate limiting requests"),
  rateLimitMax: z
    .number({ coerce: true })
    .describe("Maximum requests per time window"),
  logLevel: z
    .enum(logLevels)
    .default("info")
    .describe("The minimum level to log"),
  corsMethods: z
    .string()
    .default("*")
    .default(
      "allowed CORS methods (comma-separated) https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods",
    ),
  corsOrigin: z
    .string()
    .default("*")
    .describe(
      "allowed CORS origins (comma-separated) https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin",
    ),
});

export type Config = z.infer<typeof configSchema>;

export const config = (() => {
  return configSchema.parse({
    env: getEnv(),
    port: process.env.PORT,
    bodyLimit: parseBytes(process.env.BODY_LIMIT ?? "500KB"),
    logLevel: process.env.LOG_LEVEL,
    rateLimitTimeWindow: parseDuration(
      process.env.RATE_LIMIT_TIME_WINDOW ?? "1m",
    ),
    rateLimitMax: process.env.RATE_LIMIT_MAX,
    corsOrigin: process.env.CORS_ORIGIN,
    corsMethods: process.env.CORS_METHODS,
  });
})();
