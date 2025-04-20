import Skeleton from "@/components/skeleton";
import styles from "./roadmap-board-skeleton.module.css";

function FeedbackBoardSkeleton() {
  return (
    <div className={styles["roadmap-board-skeleton"]}>
      <div className={styles["roadmap-board-skeleton__column"]}>
        <Skeleton className={styles["roadmap-board-skeleton__title"]} />
        <Skeleton className={styles["roadmap-board-skeleton__desc"]} />
        <div className={styles["roadmap-board-skeleton__list"]}>
          <Skeleton className={styles["roadmap-board-skeleton__card"]} />
          <Skeleton className={styles["roadmap-board-skeleton__card"]} />
        </div>
      </div>
      <div className={styles["roadmap-board-skeleton__column"]}>
        <Skeleton className={styles["roadmap-board-skeleton__title"]} />
        <Skeleton className={styles["roadmap-board-skeleton__desc"]} />
        <div className={styles["roadmap-board-skeleton__list"]}>
          <Skeleton className={styles["roadmap-board-skeleton__card"]} />
          <Skeleton className={styles["roadmap-board-skeleton__card"]} />
        </div>
      </div>
      <div className={styles["roadmap-board-skeleton__column"]}>
        <Skeleton className={styles["roadmap-board-skeleton__title"]} />
        <Skeleton className={styles["roadmap-board-skeleton__desc"]} />
        <div className={styles["roadmap-board-skeleton__list"]}>
          <Skeleton className={styles["roadmap-board-skeleton__card"]} />
          <Skeleton className={styles["roadmap-board-skeleton__card"]} />
        </div>
      </div>
    </div>
  );
}

export default FeedbackBoardSkeleton;
