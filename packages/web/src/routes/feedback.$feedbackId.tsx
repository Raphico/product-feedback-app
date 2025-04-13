import FeedbackPage from "@/features/feedbacks/pages/feedback";
import feedbackApi from "@/features/feedbacks/service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feedback/$feedbackId")({
  loader: async ({ context: { store }, params: { feedbackId } }) => {
    const query = store.dispatch(
      feedbackApi.endpoints.getFeedback.initiate(feedbackId),
    );
    query.unsubscribe();
    return query;
  },
  component: FeedbackPage,
});
