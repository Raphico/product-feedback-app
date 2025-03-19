import { PasswordResetRequestDto } from "../dtos/auth.js";
import { GenericResponseDto } from "../dtos/common.js";
import { UserRepository } from "../repositories/user.js";
import { ApiError } from "../utils/error.js";

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
  const user = await db.findByField("passwordResetToken", hashedToken);
  if (!user) {
    throw new ApiError(400, "Invalid token");
  }

  if (!user.passwordResetExpiry) {
    throw new ApiError(500, "Internal Server Error");
  }

  if (Date.now() > user.passwordResetExpiry.getTime()) {
    throw new ApiError(400, "Token has expired");
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
