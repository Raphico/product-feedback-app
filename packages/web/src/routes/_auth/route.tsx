import AuthLayout from "@/features/auth/layouts/auth-layout";
import { useIsLoggedIn } from "@/features/user/hooks";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate({
        to: "/",
      });
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
