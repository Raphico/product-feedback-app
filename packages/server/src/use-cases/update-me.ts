import type { UserResponseDto } from "../dtos/user.js";
import { NotFoundError } from "../errors/common.js";
import { userToDto } from "../mappers/user.js";
import type { UserRepository } from "../repositories/user.interface.js";

export async function updateMeUseCase(
  context: {
    db: UserRepository;
  },
  data: {
    [k: string]: string | undefined;
    id: string;
  },
): Promise<UserResponseDto> {
  const { db } = context;
  const { id, ...changes } = data;

  const updatedUser = await db.update(id, changes);

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return userToDto(updatedUser);
}
