import SignupPage from "@/features/auth/pages/signup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
});
