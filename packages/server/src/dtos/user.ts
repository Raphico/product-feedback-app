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
