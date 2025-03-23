import { Readable } from "node:stream";
import type {
  UpdateAvatarRequestDto,
  UpdateUserResponseDto,
} from "../dtos/user.js";
import type { UserRepository } from "../repositories/user.js";
import { type UploadApiResponse } from "cloudinary";
import { NotFoundError, ValidationError } from "../errors/common.js";
import { deleteFile, getOptimizedUrl } from "../services/file-upload.js";

type UpdateAvatarUseCaseContext = {
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
  uploadFile: (stream: Readable) => Promise<UploadApiResponse>;
};

export async function updateAvatarUseCase(
  context: UpdateAvatarUseCaseContext,
  data: UpdateAvatarRequestDto,
): Promise<UpdateUserResponseDto> {
  const { db, uploadFile, avatarValidator } = context;
  const { avatar, userId } = data;

  const avatarBuffer = await avatar.toBuffer();
  const validationResult = await avatarValidator(avatarBuffer, 5 * 1024 * 1024);
  if (!validationResult.ok) {
    throw new ValidationError(validationResult.error);
  }

  const uploadResult = await uploadFile(Readable.from(avatarBuffer));
  const optimizedUrl = getOptimizedUrl(uploadResult.public_id, {
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

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    };
  } catch (error) {
    if (uploadResult && uploadResult.public_id) {
      await deleteFile(uploadResult.public_id);
    }

    throw error;
  }
}
