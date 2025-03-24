import type {
  UpdateMeRequestDto,
  UpdateUserResponseDto,
} from "../dtos/user.js";
import { NotFoundError } from "../errors/common.js";
import type { UserRepository } from "../repositories/user.js";

type UpdateMeUseCaseContext = {
  db: UserRepository;
};

export async function updateMeUseCase(
  context: UpdateMeUseCaseContext,
  data: UpdateMeRequestDto,
): Promise<UpdateUserResponseDto> {
  const { db } = context;
  const { id, ...changes } = data;

  const updatedUser = await db.update(id, changes);

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return {
    id: updatedUser.id,
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    username: updatedUser.username,
    avatar: updatedUser.avatar,
    role: updatedUser.role,
  };
}
