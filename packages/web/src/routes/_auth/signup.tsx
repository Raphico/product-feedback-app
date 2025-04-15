import SignupPage from "@/features/auth/pages/signup";
import { authParams } from "@/features/auth/validations";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
  validateSearch: zodValidator(authParams),
});
