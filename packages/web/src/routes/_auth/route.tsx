import AuthLayout from "@/features/auth/layouts/auth-layout";
import { redirect } from "@tanstack/react-router";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
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
