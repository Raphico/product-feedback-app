import FeedbackPage from "@/features/feedbacks/pages/feedback";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feedback/$feedbackId")({
  component: FeedbackPage,
});
