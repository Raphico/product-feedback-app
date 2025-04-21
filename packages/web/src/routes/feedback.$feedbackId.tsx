import { createFileRoute } from "@tanstack/react-router";
import feedbackApi from "@/features/feedbacks/service";
import FeedbackPage from "@/features/feedbacks/pages/feedback";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const feedbackSearch = z.object({
  goBack: fallback(z.string(), "/").default("/"),
});

export const Route = createFileRoute("/feedback/$feedbackId")({
  loader: async ({ context: { store }, params: { feedbackId } }) => {
    const query = store.dispatch(
      feedbackApi.endpoints.getFeedback.initiate(feedbackId),
    );
    await query;
    query.unsubscribe();
  },
  validateSearch: zodValidator(feedbackSearch),
  component: FeedbackPage,
});
