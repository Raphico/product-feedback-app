import { UserResponseDto } from "../dtos/user.js";
import { UserEntity } from "../models/user.js";

export function userToDto(user: UserEntity): UserResponseDto {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}
