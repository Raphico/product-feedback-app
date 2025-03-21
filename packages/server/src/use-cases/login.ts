import type { Roles } from "../config.js";
import type { LoginRequestDto, LoginResponseDto } from "../dtos/auth.js";
import {
  InvalidCredentialsError,
  UnverifiedEmailError,
} from "../errors/auth.js";
import type { UserRepository } from "../repositories/user.js";

type LoginUseCaseContext = {
  db: UserRepository;
  comparePassword: (
    password: string,
    hashedPassword: string,
  ) => Promise<boolean>;
  generateAccessToken: (payload: {
    id: string;
    email: string;
    username: string;
    role: Roles;
  }) => string;
  generateRefreshToken: (payload: { id: string }) => string;
};

export async function loginUseCase(
  context: LoginUseCaseContext,
  data: LoginRequestDto,
): Promise<LoginResponseDto> {
  const { email, password } = data;
  const { db, comparePassword, generateAccessToken, generateRefreshToken } =
    context;

  const user = await db.findOne({ email });
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    throw new InvalidCredentialsError();
  }

  if (!user.isEmailVerified) {
    throw new UnverifiedEmailError();
  }

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({ id: user.id });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    role: user.role,
    accessToken,
    refreshToken,
  };
}
