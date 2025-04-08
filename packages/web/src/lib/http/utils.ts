import type { HttpBaseQueryError } from "./client";

export function isHttpBaseQueryError(
  error: unknown,
): error is HttpBaseQueryError {
  return (
    typeof error == "object" &&
    error !== null &&
    "status" in error &&
    "data" in error &&
    typeof error.status == "number" &&
    typeof error.data == "object" &&
    error.data !== null &&
    "message" in error.data
  );
}
