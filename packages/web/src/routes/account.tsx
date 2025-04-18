import { useIsLoggedIn } from "@/features/user/hooks";
import AccountPage from "@/features/user/pages/account";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/account")({
  component: RouteComponent,
});

function RouteComponent() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({
        to: "/login",
        search: {
          redirectTo: "/create-feedback",
        },
      });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return <AccountPage />;
}
