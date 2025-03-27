import { Types } from "mongoose";

/**
 * Converts a string to a MongoDB ObjectId.
 */
export function toObjectId(id: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId format");
  }

  return new Types.ObjectId(id);
}

/**
 * Converts an ObjectId to a string.
 */
export function fromObjectId(id: Types.ObjectId): string {
  return id.toString();
}
