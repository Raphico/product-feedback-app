import { FeedbackStatuses } from "@/config";
import { useGetFeedbacksQuery } from "../../service";
import RoadmapHeader from "./components/roadmap-header";
import styles from "./index.module.css";
import { useEffect } from "react";
import { showErrorToast } from "@/utils/error";
import EmptyCard from "@/components/empty-card";
import { Link } from "@tanstack/react-router";
import IconPlus from "@/assets/icon-plus.svg?react";
import { buttonVariants } from "@/components/button";
import { useIsLoggedIn } from "@/features/user/hooks";
import RoadmapBoardSkeleton from "./components/roadmap-board-skeleton";
import RoadmapBoard from "./components/roadmap-board";

function RoadmapPage() {
  const isLoggedIn = useIsLoggedIn();
  const {
    data: feedbacks,
    isLoading,
    error,
  } = useGetFeedbacksQuery({
    status: [
      FeedbackStatuses.PLANNED,
      FeedbackStatuses.IN_PROGRESS,
      FeedbackStatuses.LIVE,
    ],
  });

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const hasFeedbacks = !!feedbacks && feedbacks.length > 0;

  return (
    <div className={styles["roadmap"]}>
      <RoadmapHeader className={styles["roadmap__header"]} />

      <div aria-live="polite" className="sr-only">
        {isLoading && <p>Loading Roadmap board</p>}
        {!isLoading && feedbacks && <p>Roadmap board Loaded</p>}
      </div>

      {isLoading ? (
        <RoadmapBoardSkeleton />
      ) : hasFeedbacks ? (
        <RoadmapBoard feedbacks={feedbacks} />
      ) : (
        <EmptyCard
          className={styles["roadmap__board-empty"]}
          title="There are no feedbacks here yet"
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

export default RoadmapPage;
