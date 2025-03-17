import type { Roles } from "../config.js";

export type SignupRequestDto = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

export type SignupResponseDto = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string | null;
  isEmailVerified: boolean;
  role: Roles;
};
