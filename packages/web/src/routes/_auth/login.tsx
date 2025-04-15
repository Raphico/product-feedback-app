import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/features/auth/pages/login";
import { zodValidator } from "@tanstack/zod-adapter";
import { authParams } from "@/features/auth/validations";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
  validateSearch: zodValidator(authParams),
});
