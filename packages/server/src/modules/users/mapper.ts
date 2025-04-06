import type { UserResponse } from "./validations.js";
import { User } from "../../db/schema.js";

export function userToDto(user: User): UserResponse {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}
