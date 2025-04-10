import Badge from "@/components/badge";
import TotalComments from "./total-comments";
import UpvoteButton from "./upvote-button";
import styles from "./feedback-item.module.css";
import type { Feedback } from "../types";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { useIsLoggedIn } from "@/features/user/hooks";

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
}: FeedbackProps) {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  function handleUpvote() {
    if (!isLoggedIn) {
      navigate({
        to: "/login",
        search: {
          redirectTo: upvoteRedirectContext,
        },
      });
    }
  }

  return (
    <article className={cn(styles["feedback"], className)}>
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
        {feedback.category}
      </Badge>
      <UpvoteButton
        className={styles["feedback__upvote-button"]}
        onClick={handleUpvote}
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
