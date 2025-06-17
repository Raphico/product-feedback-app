import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { userSchema } from "../user/validation";

export const emailSchema = z.object({
  email: z.string().email(),
});

export type EmailSchema = z.infer<typeof emailSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "Please, enter a valid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = loginSchema.extend({
  fullName: userSchema.shape.fullName,
  username: userSchema.shape.username,
});

export type SignupSchema = z.infer<typeof signupSchema>;

export const verifyEmailSchema = z.object({
  code: z.string().length(6, {
    message: "Verification code must be exactly 6 characters long",
  }),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export const authSearchParams = z.object({
  redirectTo: fallback(z.string().optional(), "/"),
  email: fallback(z.string().optional(), ""),
});
