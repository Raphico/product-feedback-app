import { useGetFeedbacksQuery } from "@/features/feedbacks/service";
import { FeedbackStatuses } from "@/config";
import styles from "./index.module.css";
import SuggestionsSkeleton from "./components/suggestions-skeleton";
import SuggestionsAside from "./components/suggestions-aside";
import SuggestionsHeader from "./components/suggestions-header";
import SuggestionList from "./components/suggestion-list";
import IconPlus from "@/assets/icon-plus.svg?react";
import { getRouteApi, Link } from "@tanstack/react-router";
import EmptyCard from "@/components/empty-card";
import { buttonVariants } from "@/components/button";

const routeApi = getRouteApi("/");

function SuggestionsPage() {
  const { sort, category } = routeApi.useSearch();
  const { data: suggestions, isLoading } = useGetFeedbacksQuery({
    status: FeedbackStatuses.SUGGESTION,
    sort,
    category,
  });

  const hasSuggestions = !!suggestions && suggestions.length > 0;

  return (
    <div className={styles["suggestions"]}>
      <SuggestionsAside className={styles["suggestions__aside"]} />
      <SuggestionsHeader
        className={styles["suggestions__header"]}
        totalSuggestions={suggestions?.length ?? 0}
      />

      <div aria-live="polite" className="sr-only">
        {isLoading && <p>Loading suggestions</p>}
        {!isLoading && suggestions && <p>Suggestions Loaded</p>}
      </div>

      {isLoading ? (
        <SuggestionsSkeleton className={styles["suggestions__skeleton"]} />
      ) : hasSuggestions ? (
        <SuggestionList
          className={styles["suggestions__list"]}
          suggestions={suggestions}
        />
      ) : (
        <EmptyCard
          className={styles["suggestions__empty"]}
          title="There are no feedbacks yet"
          description="Got a suggestion? Found a bug that needs to be squashed? We love hearing
        about new ideas to improve our app."
        >
          <Link to="/create-feedback" className={buttonVariants["primary"]}>
            <IconPlus />
            Add Feedback
          </Link>
        </EmptyCard>
      )}
    </div>
  );
}

export default SuggestionsPage;
