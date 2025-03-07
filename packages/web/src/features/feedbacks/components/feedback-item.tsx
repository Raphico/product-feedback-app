import Badge from "@/components/badge";
import TotalComments from "@/components/total-comments";
import UpvoteButton from "@/components/upvote-button";
import styles from "./feedback-item.module.css";
import type { Feedback } from "../types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface FeedbackProps extends React.ComponentProps<"article"> {
  feedback: Feedback;
  headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

function FeedbackItem({
  className,
  feedback,
  headingTag: Comp = "h3",
}: FeedbackProps) {
  return (
    <article className={cn(styles["feedback"], className)}>
      <Link to="/feedback/$feedbackId" params={{ feedbackId: feedback.id }}>
        <Comp className={cn("h3", styles["feedback__header"])}>
          {feedback.title}
        </Comp>
      </Link>
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
  );
}

export default FeedbackItem;
