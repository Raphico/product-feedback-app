import type { Feedback } from "@/features/feedbacks/types";
import styles from "./roadmap-board-column.module.css";
import { useDroppable } from "@dnd-kit/core";
import { FeedbackStatuses } from "@/config";
import RoadmapBoardItem from "./roadmap-board-item";

interface RoadmapBoardColumnProps {
  column: {
    title: string;
    description: string;
    status: FeedbackStatuses;
  };
  feedbacks: Feedback[];
}

function RoadmapBoardColumn({ column, feedbacks }: RoadmapBoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.status,
  });

  return (
    <section className={styles["roadmap-board-column"]}>
      <header className={styles["roadmap-board-column__header"]}>
        <h2 className={styles["roadmap-board-column__title"]}>
          {column.title} ({feedbacks.length})
        </h2>
        <p className={styles["roadmap-board-column__desc"]}>
          {column.description}
        </p>
      </header>
      <div ref={setNodeRef} className={styles["roadmap-board-column__list"]}>
        {feedbacks.map((feedback) => (
          <RoadmapBoardItem key={feedback.id} feedback={feedback} />
        ))}
      </div>
    </section>
  );
}

export default RoadmapBoardColumn;
