import { z } from "zod";
import { userResponseSchema } from "./user.js";

export const signupRequestSchema = z.object({
  fullName: userResponseSchema.shape.fullName,
  username: userResponseSchema.shape.username,
  email: userResponseSchema.shape.email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long"),
});

export const verifyEmailRequestSchema = z.object({
  code: z.string().length(6, {
    message: "Verification code must be exactly 6 characters long",
  }),
});

export const loginRequestSchema = z.object({
  email: userResponseSchema.shape.email,
  password: signupRequestSchema.shape.password,
});

export const emailRequestSchema = z.object({
  email: userResponseSchema.shape.email,
});

export const passwordResetParamsSchema = z.object({
  token: z.string(),
});

export const passwordResetRequestSchema = z.object({
  password: signupRequestSchema.shape.password,
});
