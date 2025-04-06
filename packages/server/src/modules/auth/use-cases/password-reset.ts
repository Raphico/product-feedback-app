import type { GenericResponse } from "../../../shared/validation.js";
import type { UserRepository } from "../../users/repository.js";
import { ExpiredTokenError, InvalidTokenError } from "../exceptions.js";

export async function passwordResetUseCase(
  context: {
    db: UserRepository;
    generateHash: (value: string) => string;
    hashPassword: (password: string) => Promise<string>;
  },
  data: { token: string; password: string },
): Promise<GenericResponse> {
  const { token, password } = data;
  const { db, generateHash, hashPassword } = context;

  const hashedToken = generateHash(token);
  const user = await db.findOne("passwordResetToken", hashedToken);
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
