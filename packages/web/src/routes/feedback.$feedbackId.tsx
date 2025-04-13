import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feedback/$feedbackId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/feedback/$feedbackId"!</div>;
}
