import type { Types } from "mongoose";
import type { GenericResponseDto } from "../dtos/common.js";
import type { UserRepository } from "../repositories/user.interface.js";
import { ConflictError } from "../errors/common.js";

export async function resendVerificationUseCase(
  context: {
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
    fromObjectId: (id: Types.ObjectId) => string;
  },
  data: { email: string },
): Promise<GenericResponseDto> {
  const { email } = data;
  const {
    db,
    generateVerificationCode,
    sendEmailVerificationCode,
    fromObjectId,
  } = context;

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

  await db.update(fromObjectId(user._id), {
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
