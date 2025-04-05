import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  emailRequestSchema,
  loginRequestSchema,
  passwordResetParamsSchema,
  passwordResetRequestSchema,
  signupRequestSchema,
  verificationSchema,
} from "./validations.js";
import { userResponseSchema } from "../users/validations.js";
import { genericResponseSchema } from "../../shared/validation.js";
import { verifyJWT } from "../../hooks/auth.js";
import { loginController } from "./controllers/login.js";
import { logoutController } from "./controllers/logout.js";
import { passwordResetController } from "./controllers/password-reset.js";
import { refreshController } from "./controllers/refresh.js";
import { requestPasswordResetController } from "./controllers/request-password-reset.js";
import { resendVerificationController } from "./controllers/resend-verification.js";
import { signupController } from "./controllers/signup.js";
import { verificationController } from "./controllers/verification.js";

const authRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/login",
    schema: {
      description: "Authenticates a user and returns access & refresh tokens.",
      summary: "User Login",
      tags: ["Auth"],
      body: loginRequestSchema,
      response: {
        200: userResponseSchema,
        400: genericResponseSchema,
        403: genericResponseSchema,
      },
    },
    handler: loginController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/logout",
    onRequest: [verifyJWT],
    schema: {
      description: "Logs out the user by clearing authentication cookies.",
      summary: "User Logout",
      tags: ["Auth"],
      response: {
        200: genericResponseSchema,
      },
    },
    handler: logoutController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/password-reset/:token",
    schema: {
      description: "Allows a user to reset their password using a reset token.",
      summary: "Password Reset",
      tags: ["Auth"],
      params: passwordResetParamsSchema,
      body: passwordResetRequestSchema,
      response: {
        200: genericResponseSchema,
        400: genericResponseSchema,
      },
    },
    handler: passwordResetController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/refresh",
    schema: {
      description:
        "Refreshes the user's access token using a valid refresh token stored in cookies.",
      summary: "Refresh Access Token",
      tags: ["Auth"],
      response: {
        200: genericResponseSchema,
        404: genericResponseSchema,
      },
    },
    handler: refreshController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/request-password-reset",
    config: {
      rateLimit: {
        max: app.config.rateLimitIntensiveMax,
      },
    },
    schema: {
      description:
        "Initiates a password reset request by sending a verification email to the user.",
      summary: "Request Password Reset",
      tags: ["Auth"],
      body: emailRequestSchema,
      response: {
        200: genericResponseSchema,
      },
    },
    handler: requestPasswordResetController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/resend-verification",
    config: {
      rateLimit: {
        max: app.config.rateLimitIntensiveMax,
      },
    },
    schema: {
      description:
        "Resend the email verification code to the user if they haven't verified their email yet.",
      summary: "Resend Email Verification",
      tags: ["Auth"],
      body: emailRequestSchema,
      response: {
        202: genericResponseSchema,
        409: genericResponseSchema,
      },
    },
    handler: resendVerificationController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/signup",
    config: {
      rateLimit: {
        max: app.config.rateLimitIntensiveMax,
      },
    },
    schema: {
      description:
        "Creates a new user account. Sends an email verification code upon successful signup.",
      summary: "User Signup",
      tags: ["Auth"],
      body: signupRequestSchema,
      response: {
        201: userResponseSchema,
        409: genericResponseSchema,
      },
    },
    handler: signupController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/verification",
    schema: {
      description:
        "Verifies a user's email using a one-time verification code.",
      summary: "Verify Email",
      tags: ["Auth"],
      body: verificationSchema,
      response: {
        200: genericResponseSchema,
        400: genericResponseSchema,
      },
    },
    handler: verificationController,
  });
};

export default authRoute;
