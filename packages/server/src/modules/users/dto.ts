import type { Roles } from "../../config.js";

export type UserResponseDto = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string | null;
  role: Roles;
};
