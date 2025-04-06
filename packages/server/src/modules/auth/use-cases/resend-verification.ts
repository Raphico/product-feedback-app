import type { GenericResponse } from "../../../shared/validation.js";
import type { UserRepository } from "../../users/repository.js";
import { ConflictError } from "../../../core/exceptions.js";

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
  },
  data: { email: string },
): Promise<GenericResponse> {
  const { email } = data;
  const { db, generateVerificationCode, sendEmailVerificationCode } = context;

  const user = await db.findOne("email", email);
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
