import { createFileRoute } from "@tanstack/react-router";
import FeedbackBoardCard from "@/features/feedbacks/components/feedback-board-card";
import RoadmapSummaryCard from "@/features/feedbacks/components/roadmap-summary-card";
import SuggestionList from "@/features/feedbacks/components/suggestion-list";
import SuggestionsHeader from "@/features/feedbacks/components/suggestions-header";
import SuggestionsFilter from "@/features/feedbacks/components/suggestions-filter";
import { useSuggestions } from "@/features/feedbacks/hooks";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const suggestions = useSuggestions();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 720px)");

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={styles["suggestions"]}>
      <aside className={styles["suggestions__aside"]}>
        <FeedbackBoardCard className={styles["suggestions__feedback-card"]} />

        {!isMobile ? (
          <>
            <SuggestionsFilter
              className={styles["suggestions__filter-desktop"]}
            />
            <RoadmapSummaryCard
              className={styles["suggestions__roadmap-desktop"]}
            />
          </>
        ) : (
          <>
            <button
              className={styles["suggestions__menu-button"]}
              aria-expanded={isOpen}
              aria-controls="menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
            ></button>

            <div
              id="menu"
              role="menu"
              aria-hidden={!isOpen}
              className={cn(styles["suggestions__menu"], {
                [styles["open"]]: isOpen,
              })}
            >
              <div className={styles["suggestions__menu-content"]}>
                <SuggestionsFilter />
                <RoadmapSummaryCard />
              </div>
            </div>
          </>
        )}
      </aside>

      <SuggestionsHeader
        className={styles["suggestions__header"]}
        totalSuggestions={suggestions.length}
      />

      <SuggestionList
        className={styles["suggestions__list"]}
        suggestions={suggestions}
      />
    </div>
  );
}
