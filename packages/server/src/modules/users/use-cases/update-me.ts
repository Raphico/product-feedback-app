import type { UserRepository } from "../repository.js";
import type { UpdateUser } from "../validations.js";
import type { UserResponse } from "../validations.js";
import { NotFoundError } from "../../../core/exceptions.js";
import { userToDto } from "../mapper.js";

export async function updateMeUseCase(
  context: {
    db: UserRepository;
  },
  data: UpdateUser & { id: string },
): Promise<UserResponse> {
  const { db } = context;
  const { id, ...changes } = data;

  const updatedUser = await db.update(id, changes);

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return userToDto(updatedUser);
}
