import type { SignupRequestDto, SignupResponseDto } from "../dtos/auth.js";
import type { UserRepository } from "../repositories/user.js";
import { ApiError } from "../utils/error.js";

type SignupUseCaseContext = {
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
};

export async function signupUseCase(
  context: SignupUseCaseContext,
  data: SignupRequestDto,
): Promise<SignupResponseDto> {
  const { fullName, email, username, password } = data;
  const { db } = context;

  const userExists = await db.findByEmailOrUsername({ email, username });
  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await context.hashPassword(password);

  const { unHashedCode, hashedCode, expiresAt } =
    context.generateVerificationCode();

  await db.create({
    email,
    fullName,
    username,
    password: hashedPassword,
    emailVerificationCode: hashedCode,
    emailVerificationExpiry: expiresAt,
  });

  const createdUser = await db.findByEmailOrUsername({ email });

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while creating user. Try again later",
    );
  }

  await context.sendEmailVerificationCode({
    emailVerificationCode: unHashedCode,
    to: createdUser.email,
    username: createdUser.username,
  });

  return {
    id: createdUser.id,
    fullName: createdUser.fullName,
    email: createdUser.email,
    username: createdUser.username,
    avatar: createdUser.avatar,
    isEmailVerified: createdUser.isEmailVerified,
    role: createdUser.role,
  };
}
