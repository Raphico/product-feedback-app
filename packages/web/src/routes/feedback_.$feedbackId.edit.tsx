import EditFeedbackPage from "@/features/feedbacks/pages/edit-feedback";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feedback_/$feedbackId/edit")({
  component: EditFeedbackPage,
});
