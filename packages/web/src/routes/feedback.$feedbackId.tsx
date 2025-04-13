import { createFileRoute } from "@tanstack/react-router";
import feedbackApi from "@/features/feedbacks/service";
import FeedbackPage from "@/features/feedbacks/pages/feedback";

export const Route = createFileRoute("/feedback/$feedbackId")({
  loader: async ({ context: { store }, params: { feedbackId } }) => {
    const query = store.dispatch(
      feedbackApi.endpoints.getFeedback.initiate(feedbackId),
    );
    await query;
    query.unsubscribe();
  },
  component: FeedbackPage,
});
