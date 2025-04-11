import { isHttpBaseQueryError } from "@/lib/http/utils";

export function getErrorMessage(error: unknown) {
  const unknownError = "Something went wrong. Please, try again later";
  if (isHttpBaseQueryError(error)) {
    return error.data.message;
  } else {
    return unknownError;
  }
}
