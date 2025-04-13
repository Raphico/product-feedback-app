import { createFileRoute } from "@tanstack/react-router";
import feedbackApi from "@/features/feedbacks/service";
import EditFeedbackPage from "@/features/feedbacks/pages/edit-feedback";

export const Route = createFileRoute("/feedback_/$feedbackId/edit")({
  loader: async ({ context: { store }, params: { feedbackId } }) => {
    const query = store.dispatch(
      feedbackApi.endpoints.getFeedback.initiate(feedbackId),
    );
    query.unsubscribe();
    return query;
  },
  component: EditFeedbackPage,
});
