import LoadingScreen from "@/components/loading-screen";
import { useGetMeQuery } from "@/features/user/service";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { isLoading } = useGetMeQuery();

  return (
    <>
      {isLoading ? <LoadingScreen /> : <Outlet />}
      <TanStackRouterDevtools />
    </>
  );
}
