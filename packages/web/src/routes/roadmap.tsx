import { FeedbackStatuses } from "@/config";
import RoadmapPage from "@/features/feedbacks/pages/roadmap";
import feedbackApi from "@/features/feedbacks/service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/roadmap")({
  loader: async ({ context: { store } }) => {
    const query = store.dispatch(
      feedbackApi.endpoints.getFeedbacks.initiate({
        status: [
          FeedbackStatuses.PLANNED,
          FeedbackStatuses.IN_PROGRESS,
          FeedbackStatuses.LIVE,
        ],
      }),
    );
    await query;
    query.unsubscribe();
  },
  component: RoadmapPage,
});
