import { z } from "zod";
import { ROLES } from "../../config.js";
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
  role: z.enum(ROLES),
});

export const updateUserSchema = z.object({
  fullName: userResponseSchema.shape.fullName,
  username: userResponseSchema.shape.username,
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const updateUserRoleSchema = z.object({
  role: userResponseSchema.shape.role,
});

export type updateUserRoleSchema = z.infer<typeof updateUserRoleSchema>;

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
