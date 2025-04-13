import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feedback_/$feedbackId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/feedback_/$feedbackId/edit"!</div>;
}
