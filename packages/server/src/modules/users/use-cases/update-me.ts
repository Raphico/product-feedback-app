import type { UserRepository } from "../repository.js";
import type { UserResponseDto } from "../dto.js";
import type { UpdateUserSchema } from "../validations.js";
import { NotFoundError } from "../../../core/exceptions.js";
import { userToDto } from "../mapper.js";

export async function updateMeUseCase(
  context: {
    db: UserRepository;
  },
  data: UpdateUserSchema & { id: string },
): Promise<UserResponseDto> {
  const { db } = context;
  const { id, ...changes } = data;

  const updatedUser = await db.update(id, changes);

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return userToDto(updatedUser);
}
