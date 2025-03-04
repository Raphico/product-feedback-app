import { createFileRoute } from "@tanstack/react-router";
import FeedbackBoardCard from "@/features/feedbacks/components/feedback-board-card";
import RoadmapSummaryCard from "@/features/feedbacks/components/roadmap-summary-card";
import SuggestionList from "@/features/feedbacks/components/suggestion-list";
import SuggestionsHeader from "@/features/feedbacks/components/suggestions-header";
import SuggestionsFilter from "@/features/feedbacks/components/suggestions-filter";
import { useSuggestions } from "@/features/feedbacks/hooks";
import styles from "./index.module.css";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const suggestions = useSuggestions();

  return (
    <div className={styles["container"]}>
      <aside>
        <FeedbackBoardCard />
        <SuggestionsFilter />
        <RoadmapSummaryCard />
      </aside>
      <SuggestionsHeader totalSuggestions={suggestions.length} />
      <SuggestionList suggestions={suggestions} />
    </div>
  );
}
