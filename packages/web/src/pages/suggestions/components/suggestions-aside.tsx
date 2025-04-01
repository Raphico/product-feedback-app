import FeedbackBoardCard from "./feedback-board-card";
import SuggestionsFilter from "./suggestions-filter";
import RoadmapCard from "./roadmap-card";
import SuggestionsMenu from "./suggestions-menu";
import styles from "./suggestions-aside.module.css";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

function SuggestionsAside({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useMediaQuery("(max-width: 720px)");

  return (
    <aside className={cn(styles["suggestions-aside"], className)}>
      <FeedbackBoardCard className={styles["suggestions-aside__board-card"]} />

      {!isMobile ? (
        <>
          <SuggestionsFilter />
          <RoadmapCard />
        </>
      ) : (
        <SuggestionsMenu />
      )}
    </aside>
  );
}

export default SuggestionsAside;
