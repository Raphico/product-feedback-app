import { User } from "../../db/schema.js";
import type { UserResponseDto } from "./dto.js";

export function userToDto(user: User): UserResponseDto {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}
