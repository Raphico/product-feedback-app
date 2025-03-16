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

export type SignupRequestSchema = z.infer<typeof signupRequestSchema>;
