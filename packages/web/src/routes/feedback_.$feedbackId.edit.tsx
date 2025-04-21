import { createFileRoute, redirect } from "@tanstack/react-router";
import feedbackApi from "@/features/feedbacks/service";
import EditFeedbackPage from "@/features/feedbacks/pages/edit-feedback";

export const Route = createFileRoute("/feedback_/$feedbackId/edit")({
  beforeLoad: ({ context: { store }, params: { feedbackId } }) => {
    const isLoggedIn = !!store.getState().user.data;
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: `/feedback/${feedbackId}`,
        },
      });
    }
  },
  loader: async ({ context: { store }, params: { feedbackId } }) => {
    const query = store.dispatch(
      feedbackApi.endpoints.getFeedback.initiate(feedbackId),
    );
    await query;
    query.unsubscribe();
  },
  component: EditFeedbackPage,
});
