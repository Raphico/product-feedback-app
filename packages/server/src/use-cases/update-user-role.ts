import { Roles } from "../config.js";
import type { UserResponseDto } from "../dtos/user.js";
import { NotFoundError, ForbiddenError } from "../errors/common.js";
import { userToDto } from "../mappers/user.js";
import type { UserRepository } from "../repositories/user.interface.js";

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

  if (currentUser.role != Roles.ADMIN) throw new ForbiddenError();

  const updatedUser = await db.update(targetUserId, {
    role: newRole,
  });

  if (!updatedUser) throw new NotFoundError("User not found");

  return userToDto(updatedUser);
}
