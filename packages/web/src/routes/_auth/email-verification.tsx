import EmailVerificationPage from "@/features/auth/pages/email-verification";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/email-verification")({
  component: EmailVerificationPage,
});
