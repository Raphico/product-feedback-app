import ForgotPasswordPage from "@/features/auth/pages/forgot-password";
import { authParams } from "@/features/auth/validations";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordPage,
  validateSearch: zodValidator(authParams),
});
