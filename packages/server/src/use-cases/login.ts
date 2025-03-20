import type { Roles } from "../config.js";
import type { LoginRequestDto, LoginResponseDto } from "../dtos/auth.js";
import type { UserRepository } from "../repositories/user.js";
import { ApiError } from "../utils/error.js";

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

  const user = await db.findByEmailOrUsername({ email });
  if (!user) {
    // generic error message to prevent attackers from distinguishing between valid and invalid emails
    throw new ApiError(400, "Invalid email or password");
  }

  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please, verify your email to login");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

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
