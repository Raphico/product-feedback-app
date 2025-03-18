import type { ResendEmailVerificationRequestDto } from "../dtos/auth.js";
import type { GenericSuccessResponseDto } from "../dtos/common.js";
import type { UserRepository } from "../repositories/user.js";
import { ApiError } from "../utils/error.js";

type ResendEmailVerificationUseCaseContext = {
  db: UserRepository;
  generateVerificationCode: () => {
    unHashedCode: string;
    hashedCode: string;
    expiresAt: Date;
  };
  sendEmailVerificationCode: ({
    username,
    emailVerificationCode,
    to,
  }: {
    username: string;
    to: string;
    emailVerificationCode: string;
  }) => Promise<void>;
};

export async function resendEmailVerificationUseCase(
  context: ResendEmailVerificationUseCaseContext,
  data: ResendEmailVerificationRequestDto,
): Promise<GenericSuccessResponseDto> {
  const { email } = data;
  const { db, generateVerificationCode, sendEmailVerificationCode } = context;

  // Avoid revealing user existence for security reasons
  const user = await db.findByEmailOrUsername({ email });
  if (!user) {
    throw new ApiError(
      202,
      "If the email exists in our records, you will receive a verification code",
    );
  }

  if (user.isEmailVerified) {
    throw new ApiError(409, "Your email is already verified");
  }

  const { unHashedCode, hashedCode, expiresAt } = generateVerificationCode();

  await db.update(user.id, {
    emailVerificationCode: hashedCode,
    emailVerificationExpiry: expiresAt,
  });

  await sendEmailVerificationCode({
    username: user.username,
    emailVerificationCode: unHashedCode,
    to: user.email,
  });

  return {
    message:
      "If the email exists in our records, you will receive a verification code shortly.",
  };
}
