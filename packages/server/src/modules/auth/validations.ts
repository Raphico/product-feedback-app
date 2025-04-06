import { z } from "zod";
import { userResponseSchema } from "../users/validations.js";

export const signupRequestSchema = z.object({
  fullName: userResponseSchema.shape.fullName,
  username: userResponseSchema.shape.username,
  email: userResponseSchema.shape.email,
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;

export const verificationSchema = z.object({
  code: z.string().length(6, {
    message: "Verification code must be exactly 6 characters long",
  }),
});

export type Verification = z.infer<typeof verificationSchema>;

export const loginRequestSchema = z.object({
  email: signupRequestSchema.shape.email,
  password: signupRequestSchema.shape.password,
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const emailRequestSchema = z.object({
  email: signupRequestSchema.shape.email,
});

export type EmailRequest = z.infer<typeof emailRequestSchema>;

export const passwordResetParamsSchema = z.object({
  token: z.string(),
});

export type PasswordResetParams = z.infer<typeof passwordResetParamsSchema>;

export const passwordResetRequestSchema = z.object({
  password: signupRequestSchema.shape.password,
});

export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
