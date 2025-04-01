import { createFileRoute } from "@tanstack/react-router";
import SuggestionsPage from "@/pages/suggestions";

export const Route = createFileRoute("/")({
  component: SuggestionsPage,
});
