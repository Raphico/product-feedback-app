import type { Roles } from "../../../config.js";
import type { UserRepository } from "../repository.js";
import type { UserResponseDto } from "../dto.js";
import { ForbiddenError, NotFoundError } from "../../../core/exceptions.js";
import { userToDto } from "../mapper.js";

export async function updateUserRoleUseCase(
  context: {
    db: UserRepository;
  },
  data: {
    targetUserId: string;
    currentUserId: string;
    newRole: Roles;
  },
): Promise<UserResponseDto> {
  const { currentUserId, newRole, targetUserId } = data;
  const { db } = context;

  const currentUser = await db.findById(currentUserId);

  if (!currentUser) throw new NotFoundError("User not found");

  if (currentUser.role != "admin") throw new ForbiddenError();

  const updatedUser = await db.update(targetUserId, {
    role: newRole,
  });

  return userToDto(updatedUser!);
}
