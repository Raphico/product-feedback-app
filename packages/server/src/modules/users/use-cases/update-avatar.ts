import type { UserRepository } from "../repository.js";
import type { FileUploadService } from "../../../services/file-upload.js";
import type { UserResponse } from "../validations.js";
import type { MultipartFile } from "@fastify/multipart";
import { Readable } from "node:stream";
import { NotFoundError, ValidationError } from "../../../core/exceptions.js";
import { userToDto } from "../mapper.js";

export async function updateAvatarUseCase(
  context: {
    db: UserRepository;
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
    fileUpload: FileUploadService;
  },
  data: {
    userId: string;
    avatarFile: MultipartFile;
  },
): Promise<UserResponse> {
  const { db, fileUpload, avatarValidator } = context;
  const { avatarFile, userId } = data;

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
    const updatedUser = await db.update(userId, {
      avatar: optimizedUrl,
    });

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    return userToDto(updatedUser);
  } catch (error) {
    if (uploadResult && uploadResult.public_id) {
      await fileUpload.deleteFile(uploadResult.public_id);
    }

    throw error;
  }
}
