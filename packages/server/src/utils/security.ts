import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { config } from "../config.js";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function generateHash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/**@description generates temporary code for email verification*/
export function generateVerificationCode() {
  const unHashedCode = crypto.randomInt(100000, 999999).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(unHashedCode)
    .digest("hex");
  const expiresAt = new Date(Date.now() + config.verificationExpiry);
  return { unHashedCode, hashedCode, expiresAt };
}
