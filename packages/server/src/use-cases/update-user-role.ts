import { Roles } from "../config.js";
import type {
  UpdateUserResponseDto,
  UpdateUserRoleRequestDto,
} from "../dtos/user.js";
import { NotFoundError, ForbiddenError } from "../errors/common.js";
import type { UserRepository } from "../repositories/user.js";

type updateUserRoleUseCaseContext = {
  db: UserRepository;
};

export async function updateUserRoleUseCase(
  context: updateUserRoleUseCaseContext,
  data: UpdateUserRoleRequestDto,
): Promise<UpdateUserResponseDto> {
  const { currentUserId, newRole, targetUserId } = data;
  const { db } = context;

  const currentUser = await db.findById(currentUserId);

  if (!currentUser) throw new NotFoundError("User not found");

  if (currentUser.role != Roles.ADMIN) throw new ForbiddenError();

  const updatedUser = await db.update(targetUserId, {
    role: newRole,
  });

  if (!updatedUser) throw new NotFoundError("User not found");

  return {
    id: updatedUser.id,
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    username: updatedUser.username,
    avatar: updatedUser.avatar,
    role: updatedUser.role,
  };
}
