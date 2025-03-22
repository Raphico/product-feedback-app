import type { SignupRequestDto, SignupResponseDto } from "../dtos/auth.js";
import { ConflictError } from "../errors/common.js";
import type { UserRepository } from "../repositories/user.js";

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

  await context.sendEmailVerificationCode({
    emailVerificationCode: unHashedCode,
    to: user.email,
    username: user.username,
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
  };
}
