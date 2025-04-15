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
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const authParams = z.object({
  redirectTo: z.string().optional(),
  email: fallback(z.string().email().optional(), ""),
});
