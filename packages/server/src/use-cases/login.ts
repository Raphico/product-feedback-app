import { UserResponseDto } from "../dtos/user.js";
import {
  InvalidCredentialsError,
  UnverifiedEmailError,
} from "../errors/auth.js";
import { userToDto } from "../mappers/user.js";
import { UserRepository } from "../repositories/user.interface.js";

export async function loginUseCase(
  context: {
    db: UserRepository;
    comparePassword: (
      password: string,
      hashedPassword: string,
    ) => Promise<boolean>;
  },
  data: { email: string; password: string },
): Promise<UserResponseDto> {
  const { email, password } = data;
  const { db, comparePassword } = context;

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

  return userToDto(user);
}
