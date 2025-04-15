import SentPasswordResetEmailPage from "@/features/auth/pages/forgot-password/sent";
import { authParams } from "@/features/auth/validations";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/_auth/forgot-password_/sent")({
  component: SentPasswordResetEmailPage,
  validateSearch: zodValidator(authParams),
});
