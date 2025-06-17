import SentPasswordResetEmailPage from "@/features/auth/pages/forgot-password/sent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forgot-password_/sent")({
  component: SentPasswordResetEmailPage,
});
