import type { UserRepository } from "../repository.js";
import type { FileUploadService } from "../../../services/file-upload.js";
import { avatarValidator, type UserResponse } from "../validations.js";
import type { MultipartFile } from "@fastify/multipart";
import { NotFoundError, ValidationError } from "../../../core/exceptions.js";
import { userToDto } from "../mapper.js";
import { Readable } from "node:stream";

export async function updateAvatarUseCase(
  context: {
    db: UserRepository;
    fileUpload: FileUploadService;
    avatarValidator: (
      buffer: Buffer,
      maxSize: number,
    ) => Promise<
      | {
          ok: false;
          error: string;
        }
      | {
          ok: true;
          error?: never;
        }
    >;
  },
  data: {
    userId: string;
    avatarFile: MultipartFile | undefined;
  },
): Promise<UserResponse> {
  const { db, fileUpload } = context;
  const { avatarFile, userId } = data;

  const user = await db.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!avatarFile) {
    if (user.avatar) {
      const oldPublicId = fileUpload.extractPublicIdFromUrl(user.avatar);
      if (oldPublicId) {
        await fileUpload.deleteFile(oldPublicId);
      }

      const updatedUser = await db.update(userId, { avatar: null });
      return userToDto(updatedUser!);
    }

    return userToDto(user);
  }

  const avatarBuffer = await avatarFile.toBuffer();
  const validationResult = await avatarValidator(avatarBuffer, 5 * 1024 * 1024);
  if (!validationResult.ok) {
    throw new ValidationError(validationResult.error);
  }

  const uploadResult = await fileUpload.uploadFile(Readable.from(avatarBuffer));
  const optimizedUrl = fileUpload.getOptimizedUrl(uploadResult.public_id, {
    fetch_format: "auto",
    quality: "auto",
  });

  try {
    const updatedUser = await db.update(userId, { avatar: optimizedUrl });

    if (user.avatar) {
      const oldPublicId = fileUpload.extractPublicIdFromUrl(user.avatar);
      if (oldPublicId) {
        await fileUpload.deleteFile(oldPublicId);
      }
    }

    return userToDto(updatedUser!);
  } catch (error) {
    // Rollback new file upload if update fails
    await fileUpload.deleteFile(uploadResult.public_id);
    throw error;
  }
}
