import type { GenericResponse } from "../../../shared/validation.js";
import { UserRepository } from "../../users/repository.js";
import { ExpiredCodeError, InvalidCodeError } from "../exceptions.js";

export async function verificationUseCase(
  context: {
    db: UserRepository;
    generateHash: (value: string) => string;
  },
  data: { code: string },
): Promise<GenericResponse> {
  const { db, generateHash } = context;
  const { code } = data;

  const hashedCode = generateHash(code);
  const user = await db.findOne("emailVerificationCode", hashedCode);
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
    message: "Email verification successful",
  };
}
