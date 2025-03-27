import type { Types } from "mongoose";
import type { GenericResponseDto } from "../dtos/common.js";
import type { UserRepository } from "../repositories/user.interface.js";
import { ExpiredTokenError, InvalidTokenError } from "../errors/auth.js";

export async function passwordResetUseCase(
  context: {
    db: UserRepository;
    generateHash: (value: string) => string;
    hashPassword: (password: string) => Promise<string>;
    fromObjectId: (id: Types.ObjectId) => string;
  },
  data: { token: string; password: string },
): Promise<GenericResponseDto> {
  const { token, password } = data;
  const { db, generateHash, hashPassword, fromObjectId } = context;

  const hashedToken = generateHash(token);
  const user = await db.findOne({ passwordResetToken: hashedToken });
  if (!user || !user.passwordResetExpiry) {
    throw new InvalidTokenError();
  }

  if (Date.now() > user.passwordResetExpiry.getTime()) {
    throw new ExpiredTokenError();
  }

  const hashedPassword = await hashPassword(password);

  await db.update(fromObjectId(user._id), {
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpiry: null,
  });

  return {
    message: "Password reset successful",
  };
}
