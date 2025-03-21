import type {
  VerifyEmailRequestDto,
  VerifyEmailResponseDto,
} from "../dtos/auth.js";
import { ExpiredCodeError, InvalidCodeError } from "../errors/auth.js";
import type { UserRepository } from "../repositories/user.js";

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
  const user = await db.findOne({ emailVerificationCode: hashedCode });
  if (!user || !user.emailVerificationExpiry) {
    throw new InvalidCodeError();
  }

  if (Date.now() > user.emailVerificationExpiry.getTime()) {
    throw new ExpiredCodeError();
  }

  await db.update(user.id, {
    isEmailVerified: true,
    emailVerificationCode: null,
    emailVerificationExpiry: null,
  });

  return {
    id: user.id,
    email: user.email,
    isEmailVerified: true,
  };
}
