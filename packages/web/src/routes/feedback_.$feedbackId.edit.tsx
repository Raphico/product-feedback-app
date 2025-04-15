import { createFileRoute } from "@tanstack/react-router";
import feedbackApi from "@/features/feedbacks/service";
import EditFeedbackPage from "@/features/feedbacks/pages/edit-feedback";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIsLoggedIn } from "@/features/user/hooks";

export const Route = createFileRoute("/feedback_/$feedbackId/edit")({
  loader: async ({ context: { store }, params: { feedbackId } }) => {
    const query = store.dispatch(
      feedbackApi.endpoints.getFeedback.initiate(feedbackId),
    );
    await query;
    query.unsubscribe();
  },
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

  return <EditFeedbackPage />;
}
