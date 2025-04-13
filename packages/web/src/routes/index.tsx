import { createFileRoute } from "@tanstack/react-router";
import SuggestionsPage from "@/features/feedbacks/pages/suggestions";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import {
  FeedbackCategories,
  FeedbackSortOptions,
  FeedbackStatuses,
} from "@/config";
import feedbackApi from "@/features/feedbacks/service";

const suggestionSearchSchema = z.object({
  category: z.nativeEnum(FeedbackCategories).optional(),
  sort: fallback(
    z.nativeEnum(FeedbackSortOptions),
    FeedbackSortOptions.MOST_UPVOTES,
  ).default(FeedbackSortOptions.MOST_UPVOTES),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(suggestionSearchSchema),
  loaderDeps: ({ search: { sort, category } }) => ({ sort, category }),
  loader: async ({ context: { store }, deps: { category, sort } }) => {
    const query = store.dispatch(
      feedbackApi.endpoints.getFeedbacks.initiate({
        category,
        sort,
        status: FeedbackStatuses.SUGGESTION,
      }),
    );
    await query;
    query.unsubscribe();
  },
  component: SuggestionsPage,
});
