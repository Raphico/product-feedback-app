import { z } from "zod";
import { Roles } from "../config.js";

export const userSchema = z.object({
  id: z.string(),
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
  email: z.string().email("Invalid email format").toLowerCase(),
  avatar: z.string().url("Invalid avatar").nullable(),
  role: z.nativeEnum(Roles),
});

export type UserSchema = z.infer<typeof userSchema>;

export const updateUserSchema = z
  .object({
    fullName: userSchema.shape.fullName.optional(),
    username: userSchema.shape.username.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })
  .transform((data) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );
  });
