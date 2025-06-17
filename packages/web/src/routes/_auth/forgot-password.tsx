import ForgotPasswordPage from "@/features/auth/pages/forgot-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordPage,
});
