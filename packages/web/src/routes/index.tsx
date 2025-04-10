import { createFileRoute } from "@tanstack/react-router";
import SuggestionsPage from "@/features/feedbacks/pages/suggestions";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { FeedbackCategories, FeedbackSortOptions } from "@/config";

const suggestionSearchSchema = z.object({
  category: z.nativeEnum(FeedbackCategories).optional(),
  sort: fallback(
    z.nativeEnum(FeedbackSortOptions),
    FeedbackSortOptions.MOST_UPVOTES,
  ).default(FeedbackSortOptions.MOST_UPVOTES),
});

export const Route = createFileRoute("/")({
  component: SuggestionsPage,
  validateSearch: zodValidator(suggestionSearchSchema),
});
