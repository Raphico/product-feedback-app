import { useIsLoggedIn } from "@/features/user/hooks";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
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

  return <Outlet />;
}
