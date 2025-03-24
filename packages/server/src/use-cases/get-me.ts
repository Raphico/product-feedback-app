import { UpdateUserResponseDto } from "../dtos/user.js";
import { NotFoundError } from "../errors/common.js";
import type { UserRepository } from "../repositories/user.js";

export async function getMeUseCase(
  context: {
    db: UserRepository;
  },
  data: { id: string },
): Promise<UpdateUserResponseDto> {
  const { db } = context;
  const { id } = data;

  const user = await db.findById(id);

  if (!user) throw new NotFoundError("User not found");

  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}
