import { createFileRoute } from "@tanstack/react-router";
import CreateFeedbackPage from "@/features/feedbacks/pages/create-feedback";

export const Route = createFileRoute("/create-feedback")({
  component: CreateFeedbackPage,
});
