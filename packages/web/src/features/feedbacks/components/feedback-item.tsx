import Badge from "@/components/badge";
import TotalComments from "./total-comments";
import UpvoteButton from "./upvote-button";
import styles from "./feedback-item.module.css";
import type { Feedback } from "../types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface FeedbackProps extends React.ComponentProps<"article"> {
  feedback: Feedback;
  isFeedbackPage?: boolean;
  upvoteRedirectContext?: string;
  headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

function FeedbackItem({
  className,
  feedback,
  upvoteRedirectContext = "/",
  isFeedbackPage = false,
  headingTag: Comp = "h3",
  ...props
}: FeedbackProps) {
  return (
    <article className={cn(styles["feedback"], className)} {...props}>
      {!isFeedbackPage ? (
        <Link
          className={styles["feedback__page-link"]}
          to="/feedback/$feedbackId"
          params={{ feedbackId: feedback.id }}
        >
          <Comp className={cn("h3", styles["feedback__header"])}>
            {feedback.title}
          </Comp>
        </Link>
      ) : (
        <Comp className={cn("h3", styles["feedback__header"])}>
          {feedback.title}
        </Comp>
      )}
      <p className={styles["feedback__desc"]}>{feedback.detail}</p>
      <Badge className={styles["feedback__category"]}>
        {feedback.category.length == 2
          ? feedback.category.toUpperCase()
          : feedback.category}
      </Badge>
      <UpvoteButton
        className={styles["feedback__upvote-button"]}
        feedbackId={feedback.id}
        upvoteRedirectContext={upvoteRedirectContext}
        upvotes={feedback.upvoteCount}
        hasUpvote={feedback.hasUpvote}
      />
      <TotalComments
        className={styles["feedback__total-comments"]}
        total={feedback.commentCount}
      />
    </article>
  );
}

export default FeedbackItem;
