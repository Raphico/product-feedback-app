import ResetPasswordPage from "@/features/auth/pages/reset-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reset-password/$token")({
  component: ResetPasswordPage,
});
