import type { UserResponse } from "../../users/validations.js";
import type { UserRepository } from "../../users/repository.js";
import { userToDto } from "../../users/mapper.js";
import {
  InvalidCredentialsError,
  UnverifiedEmailError,
} from "../exceptions.js";

export async function loginUseCase(
  context: {
    db: UserRepository;
    comparePassword: (
      password: string,
      hashedPassword: string,
    ) => Promise<boolean>;
  },
  data: { email: string; password: string },
): Promise<UserResponse> {
  const { email, password } = data;
  const { db, comparePassword } = context;

  const user = await db.findOne("email", email);
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
