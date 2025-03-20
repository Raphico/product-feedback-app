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

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  accessToken: string;
  refreshToken: string;
} & SignupResponseDto;

export type VerifyEmailRequestDto = {
  code: string;
};

export type VerifyEmailResponseDto = {
  id: string;
  email: string;
  isEmailVerified: boolean;
};

export type EmailRequestDto = {
  email: string;
};

export type PasswordResetRequestDto = {
  token: string;
  password: string;
};
