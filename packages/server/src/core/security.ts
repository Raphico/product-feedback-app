import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { config } from "../config.js";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateHash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function generateVerificationCode(): {
  unHashedCode: string;
  hashedCode: string;
  expiresAt: Date;
} {
  const unHashedCode = crypto.randomInt(100000, 999999).toString();
  const hashedCode = generateHash(unHashedCode);
  const expiresAt = new Date(Date.now() + config.verificationExpiry);
  return { unHashedCode, hashedCode, expiresAt };
}

export function generateVerificationToken(): {
  unHashedToken: string;
  hashedToken: string;
  expiresAt: Date;
} {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = generateHash(unHashedToken);
  const expiresAt = new Date(Date.now() + config.verificationExpiry);

  return {
    unHashedToken,
    hashedToken,
    expiresAt,
  };
}

export function generateAccessToken(payload: { id: string }): string {
  return jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiry,
  });
}

export function generateRefreshToken(payload: { id: string }): string {
  return jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiry,
  });
}

export function verifyToken(
  token: string,
  secret: string,
): string | jwt.JwtPayload {
  return jwt.verify(token, secret);
}
