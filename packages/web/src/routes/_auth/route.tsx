import AuthLayout from "@/features/auth/layouts/auth-layout";
import { authSearchParams } from "@/features/auth/validations";
import { redirect, retainSearchParams } from "@tanstack/react-router";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/_auth")({
  validateSearch: zodValidator(authSearchParams),
  search: {
    middlewares: [retainSearchParams(["redirectTo", "email"])],
  },
  beforeLoad: ({ context: { store } }) => {
    const isLoggedIn = !!store.getState().user.data;
    if (isLoggedIn) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: () => {
    return (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    );
  },
});
