import { Readable } from "node:stream";
import type { UserResponseDto } from "../dtos/user.js";
import { NotFoundError, ValidationError } from "../errors/common.js";
import { MultipartFile } from "@fastify/multipart";
import { UserRepository } from "../repositories/user.interface.js";
import { userToDto } from "../mappers/user.js";
import { FileUploadService } from "../services/file-upload.js";

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
): Promise<UserResponseDto> {
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
