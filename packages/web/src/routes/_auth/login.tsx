import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/features/auth/pages/login";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";

const loginParams = z.object({
  redirectTo: z.string().optional(),
  email: fallback(z.string().email().optional(), ""),
});

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
  validateSearch: zodValidator(loginParams),
});
