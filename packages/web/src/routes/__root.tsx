import { ErrorBoundary } from "@/components/error-boundary";
import { useGetMeQuery } from "@/features/user/service";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  useGetMeQuery();

  return (
    <ErrorBoundary>
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </ErrorBoundary>
  );
}
