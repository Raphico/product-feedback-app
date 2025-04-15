import CreateFeedbackPage from "@/features/feedbacks/pages/create-feedback";
import { useIsLoggedIn } from "@/features/user/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/create-feedback")({
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

  return <CreateFeedbackPage />;
}
