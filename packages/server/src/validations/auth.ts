import { z } from "zod";
import { userSchema } from "./user.js";

export const signupRequestSchema = z.object({
  fullName: userSchema.shape.fullName,
  username: userSchema.shape.username,
  email: userSchema.shape.email,
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

export const verifyEmailResponseSchema = z.object({
  id: userSchema.shape.id,
  email: userSchema.shape.email,
  isEmailVerified: userSchema.shape.isEmailVerified,
});
