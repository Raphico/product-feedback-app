import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { config } from "../config.js";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function generateHash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function generateVerificationCode() {
  const unHashedCode = crypto.randomInt(100000, 999999).toString();
  const hashedCode = generateHash(unHashedCode);
  const expiresAt = new Date(Date.now() + config.verificationExpiry);
  return { unHashedCode, hashedCode, expiresAt };
}

export function generateVerificationToken() {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = generateHash(unHashedToken);
  const expiresAt = new Date(Date.now() + config.verificationExpiry);

  return {
    unHashedToken,
    hashedToken,
    expiresAt,
  };
}
