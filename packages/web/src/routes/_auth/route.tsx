import { useIsLoggedIn } from "@/features/user/hooks";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    redirect({
      to: "/",
    });
  }
  return <Outlet />;
}
