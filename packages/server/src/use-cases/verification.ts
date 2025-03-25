import type { GenericResponseDto } from "../dtos/common.js";
import type { UserRepository } from "../repositories/user.interface.js";
import { ExpiredCodeError, InvalidCodeError } from "../errors/auth.js";

export async function verificationUseCase(
  context: {
    db: UserRepository;
    generateHash: (value: string) => string;
  },
  data: { code: string },
): Promise<GenericResponseDto> {
  const { db, generateHash } = context;
  const { code } = data;

  const hashedCode = generateHash(code);
  const user = await db.findOne({ emailVerificationCode: hashedCode });
  if (!user || !user.emailVerificationExpiry) {
    throw new InvalidCodeError();
  }

  if (Date.now() > user.emailVerificationExpiry.getTime()) {
    throw new ExpiredCodeError();
  }

  await db.update(user._id.toString(), {
    isEmailVerified: true,
    emailVerificationCode: null,
    emailVerificationExpiry: null,
  });

  return {
    message: "Email verification successful",
  };
}
