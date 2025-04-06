import type { UserResponse } from "../../users/validations.js";
import type { UserRepository } from "../../users/repository.js";
import {
  ConflictError,
  InternalServerError,
} from "../../../core/exceptions.js";
import { userToDto } from "../../users/mapper.js";

export async function signupUseCase(
  context: {
    hashPassword: (password: string) => Promise<string>;
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
    db: UserRepository;
  },
  data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  },
): Promise<UserResponse> {
  const { fullName, email, username, password } = data;
  const { db } = context;

  const userExists = await db.findByEmailOrUsername({ email, username });
  if (userExists) {
    throw new ConflictError("User already exists");
  }

  const hashedPassword = await context.hashPassword(password);

  const { unHashedCode, hashedCode, expiresAt } =
    context.generateVerificationCode();

  const user = await db.create({
    email,
    fullName,
    username,
    password: hashedPassword,
    emailVerificationCode: hashedCode,
    emailVerificationExpiry: expiresAt,
  });

  if (!user) {
    throw new InternalServerError("User creation failed");
  }

  await context.sendEmailVerificationCode({
    emailVerificationCode: unHashedCode,
    to: user.email,
    username: user.username,
  });

  return userToDto(user);
}
