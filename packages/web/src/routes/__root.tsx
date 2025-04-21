import { ErrorBoundary } from "@/components/error-boundary";
import UserDock from "@/features/user/components/user-dock";
import { Store } from "@/lib/store";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<{ store: Store }>()({
  component: () => {
    return (
      <ErrorBoundary>
        <main>
          <Outlet />
          <UserDock />
        </main>
        <TanStackRouterDevtools />
      </ErrorBoundary>
    );
  },
});
