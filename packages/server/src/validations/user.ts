import { z } from "zod";
import { Roles } from "../config.js";
import { validateBufferMIMEType } from "validate-image-type";

export const userResponseSchema = z.object({
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

export const updateUserSchema = z
  .object({
    fullName: userResponseSchema.shape.fullName.optional(),
    username: userResponseSchema.shape.username.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })
  .transform((data) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );
  });

export const updateUserRoleSchema = z.object({
  role: userResponseSchema.shape.role,
});

export async function avatarValidator(
  buffer: Buffer,
  maxSize: number,
): Promise<
  | {
      ok: false;
      error: string;
    }
  | {
      ok: true;
      error?: never;
    }
> {
  if (buffer.byteLength > maxSize) {
    return { ok: false, error: `File exceeds max size of ${maxSize} bytes` };
  }

  const mimeValidation = await validateBufferMIMEType(buffer, {
    allowMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ],
  });

  if (mimeValidation.ok) {
    return { ok: true };
  }

  return { ok: false, error: "Invalid file type" };
}
