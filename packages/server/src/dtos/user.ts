import type { MultipartFile } from "@fastify/multipart";
import type { Roles } from "../config.js";

export type UserDto = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar: string | null;
  isEmailVerified: boolean;
  role: Roles;
  emailVerificationCode: string | null;
  emailVerificationExpiry: Date | null;
  passwordResetToken: string | null;
  passwordResetExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserDto = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  emailVerificationCode: string;
  emailVerificationExpiry: Date;
};

export type UpdateUserRoleRequestDto = {
  targetUserId: string;
  currentUserId: string;
  newRole: Roles;
};

export type UpdateAvatarRequestDto = {
  avatar: MultipartFile;
  userId: string;
};

export type UpdateUserRequestDto = {
  id: string;
  [k: string]: string | undefined;
};

export type UpdateUserResponseDto = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string | null;
  role: Roles;
};
