import { z } from "zod";
import parseDuration from "parse-duration";
import parseBytes from "bytes";
import type { CookieSerializeOptions } from "@fastify/cookie";

export enum Env {
  Dev = "development",
  Prod = "production",
  Test = "test",
}

export enum Roles {
  USER = "user",
  ADMIN = "admin",
}

export enum FeedbackCategories {
  UI = "ui",
  UX = "ux",
  FEATURE = "feature",
  BUG = "bug",
  ENHANCEMENT = "enhancement",
}

export enum FeedbackStatuses {
  SUGGESTION = "suggestion",
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  LIVE = "live",
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

export function getCookieOptions(env: Env): CookieSerializeOptions {
  return {
    path: "/",
    httpOnly: true,
    secure: env === Env.Prod,
  };
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
  rateLimitIntensiveMax: z
    .number({ coerce: true })
    .describe(
      "Maximum requests per time window for resource intensive endpoints like email sending",
    ),
  rateLimitTimeWindow: z
    .number({ coerce: true })
    .describe("the time window in millisecond for rate limiting requests"),
  rateLimitMax: z
    .number({ coerce: true })
    .describe("Maximum requests per time window"),
  shutdownTimeout: z
    .number({ coerce: true })
    .describe(
      "Maximum time in milliseconds allowed for cleanup tasks before forceful shutdown",
    ),
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
  databaseUrl: z.string().url().describe("mongodb database url"),
  verificationExpiry: z
    .number({ coerce: true })
    .describe(
      "Expiry in milliseconds for email verification code, password resets, etc",
    ),
  smtpHost: z.string().describe("SMTP server hostname for sending emails"),
  smtpPort: z
    .number({ coerce: true })
    .describe("Port number for the SMTP server"),
  smtpUser: z.string().describe("Username for SMTP authentication"),
  smtpPass: z.string().describe("Password for SMTP authentication"),
  senderEmailAddress: z
    .string()
    .email()
    .describe("Email address used to send outgoing emails"),
  clientUrl: z.string().url().describe("The base URL of the frontend client"),
  clientForgotPasswordRedirectUrl: z
    .string()
    .url()
    .describe("Frontend URL for the password reset page"),
  accessTokenSecret: z
    .string()
    .describe("Secret key used for signing access tokens"),
  accessTokenExpiry: z
    .number({ coerce: true })
    .transform((value) => value / 1000)
    .describe("Expiration duration for access tokens in seconds"),
  refreshTokenSecret: z
    .string()
    .describe("Secret key used for signing refresh tokens"),
  refreshTokenExpiry: z
    .number({ coerce: true })
    .transform((value) => value / 1000)
    .describe("Expiration duration for refresh tokens in seconds"),
  serviceName: z.string().default("Feedback App API").describe("The API name"),
  serviceDescription: z
    .string()
    .default("The API for the product feedback app")
    .describe("Service description"),
  serviceVersion: z.string().default("1.0.0").describe("API version"),
  swaggerUIPath: z.string().default("/api/docs").describe("Swagger UI path"),
  cloudinaryCloudName: z
    .string()
    .describe("The unique Cloudinary cloud name associated with your account."),
  cloudinaryApiKey: z
    .string()
    .describe("The Cloudinary API key used for authentication and API access."),
  cloudinarySecret: z
    .string()
    .describe(
      "The Cloudinary API secret key used for secure API authentication.",
    ),
});

export type Config = z.infer<typeof configSchema>;

export const config = (() => {
  return configSchema.parse({
    env: getEnv(),
    port: process.env.PORT,
    bodyLimit: parseBytes(process.env.BODY_LIMIT ?? "500KB"),
    logLevel: process.env.LOG_LEVEL,
    rateLimitIntensiveMax: process.env.RATE_LIMIT_INTENSIVE_MAX,
    rateLimitTimeWindow: parseDuration(
      process.env.RATE_LIMIT_TIME_WINDOW ?? "1m",
    ),
    rateLimitMax: process.env.RATE_LIMIT_MAX,
    shutdownTimeout: parseDuration(process.env.SHUTDOWN_TIMEOUT ?? "5s"),
    corsOrigin: process.env.CORS_ORIGIN,
    corsMethods: process.env.CORS_METHODS,
    databaseUrl: process.env.DATABASE_URL,
    verificationExpiry: parseDuration(process.env.VERIFICATION_EXPIRY),
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USERNAME,
    smtpPass: process.env.SMTP_PASSWORD,
    senderEmailAddress: process.env.SENDER_EMAIL_ADDRESS,
    clientUrl: process.env.CLIENT_URL,
    clientForgotPasswordRedirectUrl:
      process.env.CLIENT_FORGOT_PASSWORD_REDIRECT_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiry: parseDuration(process.env.ACCESS_TOKEN_EXPIRY),
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: parseDuration(process.env.REFRESH_TOKEN_EXPIRY),
    serviceName: process.env.SERVICE_NAME,
    serviceDescription: process.env.SERVICE_DESCRIPTION,
    serviceVersion: process.env.SERVICE_VERSION,
    swaggerUIPath: process.env.SWAGGER_UI_PATH,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinarySecret: process.env.CLOUDINARY_SECRET,
  });
})();
