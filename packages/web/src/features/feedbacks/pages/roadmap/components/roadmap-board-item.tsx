import type { Feedback } from "@/features/feedbacks/types";
import styles from "./roadmap-board-item.module.css";
import { useDraggable } from "@dnd-kit/core";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import Badge from "@/components/badge";
import UpvoteButton from "@/features/feedbacks/components/upvote-button";
import TotalComments from "@/features/feedbacks/components/total-comments";
import { useUser } from "@/features/user/hooks";

interface RoadmapBoardItem {
  feedback: Feedback;
}

function RoadmapBoardItem({ feedback }: RoadmapBoardItem) {
  const { data: user } = useUser();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: feedback.id,
    data: {
      status: feedback.status,
    },
    disabled: user?.role != "admin",
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        cursor: "grabbing",
      }
    : undefined;

  return (
    <article
      className={styles["roadmap-board-item"]}
      data-column={feedback.status}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <Link
        className={styles["roadmap-board-item__page-link"]}
        to="/feedback/$feedbackId"
        search={{
          goBack: "/roadmap",
        }}
        params={{ feedbackId: feedback.id }}
        data-no-dnd
      >
        <h3 className={cn("h3", styles["roadmap-board-item__title"])}>
          {feedback.title}
        </h3>
      </Link>
      <p className={styles["roadmap-board-item__desc"]}>{feedback.detail}</p>
      <Badge className={styles["roadmap-board-item__category"]}>
        {feedback.category.length == 2
          ? feedback.category.toUpperCase()
          : feedback.category}
      </Badge>
      <UpvoteButton
        data-no-dnd
        className={styles["roadmap-board-item__upvote-button"]}
        upvotes={feedback.upvoteCount}
        feedbackId={feedback.id}
        upvoteRedirectContext="/roadmap"
        hasUpvote={feedback.hasUpvote}
      />
      <TotalComments
        className={styles["roadmap-board-item__total-comments"]}
        total={feedback.commentCount}
      />
    </article>
  );
}

export default RoadmapBoardItem;
