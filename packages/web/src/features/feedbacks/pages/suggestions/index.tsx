import { useGetFeedbacksQuery } from "@/features/feedbacks/service";
import { FeedbackStatuses } from "@/config";
import styles from "./index.module.css";
import SuggestionsAside from "./components/suggestions-aside";
import SuggestionsHeader from "./components/suggestions-header";
import SuggestionList from "./components/suggestion-list";
import IconPlus from "@/assets/icon-plus.svg?react";
import { getRouteApi, Link } from "@tanstack/react-router";
import EmptyCard from "@/components/empty-card";
import { buttonVariants } from "@/components/button";
import { useEffect } from "react";
import { useIsLoggedIn } from "@/features/user/hooks";
import { showErrorToast } from "@/utils/error";
import SuggestionsSkeleton from "./components/suggestions-skeleton";

const routeApi = getRouteApi("/");

function SuggestionsPage() {
  const isLoggedIn = useIsLoggedIn();
  const { sort, category } = routeApi.useSearch();
  const {
    data: suggestions,
    isLoading,
    error,
  } = useGetFeedbacksQuery({
    status: FeedbackStatuses.SUGGESTION,
    sort,
    category,
  });

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

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
          <Link
            to={isLoggedIn ? "/create-feedback" : "/login"}
            search={isLoggedIn ? {} : { redirectTo: "/create-feedback" }}
            className={buttonVariants["primary"]}
          >
            <IconPlus />
            Add Feedback
          </Link>
        </EmptyCard>
      )}
    </div>
  );
}

export default SuggestionsPage;
