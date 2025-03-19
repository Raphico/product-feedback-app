import type {
  VerifyEmailRequestDto,
  VerifyEmailResponseDto,
} from "../dtos/auth.js";
import type { UserRepository } from "../repositories/user.js";
import { ApiError } from "../utils/error.js";

type verificationUseCaseContext = {
  db: UserRepository;
  generateHash: (value: string) => string;
};

export async function verificationUseCase(
  context: verificationUseCaseContext,
  data: VerifyEmailRequestDto,
): Promise<VerifyEmailResponseDto> {
  const { db, generateHash } = context;
  const { code } = data;

  const hashedCode = generateHash(code);
  const user = await db.findByEmailVerificationCode(hashedCode);
  if (!user) {
    throw new ApiError(400, "Invalid verification code");
  }

  if (!user.emailVerificationExpiry) {
    throw new ApiError(500, "Internal server error");
  }

  if (Date.now() > user.emailVerificationExpiry.getTime()) {
    throw new ApiError(400, "Verification code has expired");
  }

  const updatedUser = await db.update(user.id, {
    isEmailVerified: true,
    emailVerificationCode: null,
    emailVerificationExpiry: null,
  });

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong. Please try again later");
  }

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    isEmailVerified: updatedUser.isEmailVerified,
  };
}
