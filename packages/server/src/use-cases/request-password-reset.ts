import type { Types } from "mongoose";
import type { GenericResponseDto } from "../dtos/common.js";
import type { UserRepository } from "../repositories/user.interface.js";

export async function requestPasswordResetUseCase(
  context: {
    db: UserRepository;
    generateVerificationToken: () => {
      unHashedToken: string;
      hashedToken: string;
      expiresAt: Date;
    };
    sendPasswordResetLink: ({
      username,
      to,
      passwordResetUrl,
    }: {
      username: string;
      to: string;
      passwordResetUrl: string;
    }) => Promise<void>;
    url: string;
    fromObjectId: (id: Types.ObjectId) => string;
  },
  data: { email: string },
): Promise<GenericResponseDto> {
  const { email } = data;
  const {
    db,
    sendPasswordResetLink,
    generateVerificationToken,
    url,
    fromObjectId,
  } = context;

  const user = await db.findOne({ email });
  if (!user) {
    // Avoid revealing user existence for security reasons
    return {
      message:
        "If your email is in our records, a password reset link will be sent shortly",
    };
  }

  const { unHashedToken, hashedToken, expiresAt } = generateVerificationToken();

  await db.update(fromObjectId(user._id), {
    passwordResetToken: hashedToken,
    passwordResetExpiry: expiresAt,
  });

  await sendPasswordResetLink({
    username: user.username,
    to: user.email,
    passwordResetUrl: `${url}/${unHashedToken}`,
  });

  return {
    message:
      "If your email is in our records, a password reset link will be sent shortly",
  };
}
