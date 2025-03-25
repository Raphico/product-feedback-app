import type { UserResponseDto } from "../dtos/user.js";
import type { UserRepository } from "../repositories/user.interface.js";
import { NotFoundError } from "../errors/common.js";
import { userToDto } from "../mappers/user.js";

export async function getMeUseCase(
  context: {
    db: UserRepository;
  },
  data: { id: string },
): Promise<UserResponseDto> {
  const { db } = context;
  const { id } = data;

  const user = await db.findById(id);

  if (!user) throw new NotFoundError("User not found");

  return userToDto(user);
}
