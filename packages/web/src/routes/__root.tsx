import { ErrorBoundary } from "@/components/error-boundary";
import { useGetMeQuery } from "@/features/user/service";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  useGetMeQuery();

  return (
    <ErrorBoundary>
      <Outlet />
      <TanStackRouterDevtools />
    </ErrorBoundary>
  );
}
