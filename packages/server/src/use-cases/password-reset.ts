import type { PasswordResetRequestDto } from "../dtos/auth.js";
import type { GenericResponseDto } from "../dtos/common.js";
import { ExpiredTokenError, InvalidTokenError } from "../errors/auth.js";
import type { UserRepository } from "../repositories/user.js";

type PasswordResetUseCaseContext = {
  db: UserRepository;
  generateHash: (value: string) => string;
  hashPassword: (password: string) => Promise<string>;
};

export async function passwordResetUseCase(
  context: PasswordResetUseCaseContext,
  data: PasswordResetRequestDto,
): Promise<GenericResponseDto> {
  const { token, password } = data;
  const { db, generateHash, hashPassword } = context;

  const hashedToken = generateHash(token);
  const user = await db.findOne({ passwordResetToken: hashedToken });
  if (!user || !user.passwordResetExpiry) {
    throw new InvalidTokenError();
  }

  if (Date.now() > user.passwordResetExpiry.getTime()) {
    throw new ExpiredTokenError();
  }

  const hashedPassword = await hashPassword(password);

  await db.update(user.id, {
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpiry: null,
  });

  return {
    message: "Password reset successful",
  };
}
