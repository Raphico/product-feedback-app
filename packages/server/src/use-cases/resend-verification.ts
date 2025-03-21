import type { EmailRequestDto } from "../dtos/auth.js";
import type { GenericResponseDto } from "../dtos/common.js";
import { ConflictError } from "../errors/common.js";
import type { UserRepository } from "../repositories/user.js";

type ResendVerificationUseCaseContext = {
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

export async function resendVerificationUseCase(
  context: ResendVerificationUseCaseContext,
  data: EmailRequestDto,
): Promise<GenericResponseDto> {
  const { email } = data;
  const { db, generateVerificationCode, sendEmailVerificationCode } = context;

  const user = await db.findOne({ email });
  if (!user) {
    // Avoid revealing user existence for security reasons
    return {
      message:
        "If the email exists in our records, you will receive a verification code shortly.",
    };
  }

  if (user.isEmailVerified) {
    throw new ConflictError("Your email is already verified");
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
