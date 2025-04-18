import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
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

export type UserSchema = z.infer<typeof userSchema>;

export const updateAvatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "image/svg+xml",
        ].includes(file.type),
      { message: "Invalid image file type" },
    )
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .nullable(),
});

export type UpdateAvatarSchema = z.infer<typeof updateAvatarSchema>;
