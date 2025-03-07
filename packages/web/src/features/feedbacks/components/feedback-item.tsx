import Badge from "@/components/badge";
import TotalComments from "@/components/total-comments";
import UpvoteButton from "@/components/upvote-button";
import styles from "./suggestion-list-item.module.css";
import type { Feedback } from "@/features/feedbacks/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

function FeedbackItem({ feedback }: { feedback: Feedback }) {
  return (
    <Link to=".">
      <article className={styles["feedback"]}>
        <h3 className={cn("h3", styles["feedback__header"])}>
          {feedback.title}
        </h3>
        <p className={styles["feedback__desc"]}>{feedback.description}</p>
        <Badge className={styles["feedback__category"]}>
          {feedback.category}
        </Badge>
        <UpvoteButton
          className={styles["feedback__upvote-button"]}
          upvotes={feedback.upvotes}
        />
        <TotalComments
          className={styles["feedback__total-comments"]}
          total={feedback.comments.length}
        />
      </article>
    </Link>
  );
}

export default FeedbackItem;
