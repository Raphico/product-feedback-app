import type { UserResponseDto } from "../dtos/user.js";
import type { UserEntity } from "../models/user.js";
import { fromObjectId } from "../utils/object-id.js";

export function userToDto(user: UserEntity): UserResponseDto {
  return {
    id: fromObjectId(user._id),
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}
