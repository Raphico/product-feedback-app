import type { UserRepository } from "../repository.js";
import type { UserResponse } from "../validations.js";
import { NotFoundError } from "../../../core/exceptions.js";
import { userToDto } from "../mapper.js";

export async function getMeUseCase(
  context: { db: UserRepository },
  data: { id: string },
): Promise<UserResponse> {
  const { db } = context;
  const { id } = data;

  const user = await db.findById(id);

  if (!user) throw new NotFoundError("User not found");

  return userToDto(user);
}
