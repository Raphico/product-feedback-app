import EmailVerificationPage from "@/features/auth/pages/email-verification";
import { authParams } from "@/features/auth/validations";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/_auth/email-verification")({
  component: EmailVerificationPage,
  validateSearch: zodValidator(authParams),
});
