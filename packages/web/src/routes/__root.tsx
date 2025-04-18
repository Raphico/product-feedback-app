import { ErrorBoundary } from "@/components/error-boundary";
import UserDock from "@/features/user/components/user-dock";
import userApi from "@/features/user/service";
import { Store } from "@/lib/store";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<{ store: Store }>()({
  loader: async ({ context: { store } }) => {
    const query = store.dispatch(userApi.endpoints.getMe.initiate());
    await query;
    query.unsubscribe();
  },
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
