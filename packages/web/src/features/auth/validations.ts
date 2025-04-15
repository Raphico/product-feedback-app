import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

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
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(50, "Full name must be at most 50 characters long")
    .trim()
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .toLowerCase()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
});

export type SignupSchema = z.infer<typeof signupSchema>;

export const authParams = z.object({
  redirectTo: fallback(z.string().optional(), "/"),
  email: fallback(z.string().optional(), ""),
});
