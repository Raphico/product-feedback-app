import { isHttpBaseQueryError } from "@/lib/http/utils";
import { toast } from "sonner";

export function getErrorMessage(error: unknown): string {
  const unknownError = "Something went wrong. Please, try again later";
  if (isHttpBaseQueryError(error)) {
    return error.data.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(error: unknown): void {
  toast.error(getErrorMessage(error));
}
