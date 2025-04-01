import { createFileRoute, Link } from "@tanstack/react-router";
import styles from "./index.module.css";
import GoBack from "@/components/go-back";
import FeedbackItem from "@/features/feedbacks/components/feedback-item";
import { buttonVariants } from "@/components/button";
import { cn } from "@/lib/utils";
import AddComment from "@/features/comments/components/add-comment";
import CommentList from "@/features/comments/components/comment-list";

export const Route = createFileRoute("/feedback/$feedbackId/")({
  component: Feedback,
});

function Feedback() {
  const { feedbackId } = Route.useParams();
  const feedback = null;

  if (!feedback) {
    return;
  }

  return (
    <div className={styles["feedback"]}>
      <GoBack className={styles["feedback__go-back"]} />
      <Link
        to="/feedback/$feedbackId/edit"
        params={{ feedbackId }}
        className={cn(
          buttonVariants["tertiary"],
          styles["feedback__edit-link"],
        )}
      >
        Edit feedback
      </Link>
      <FeedbackItem
        headingTag="h1"
        className={styles["feedback__item"]}
        feedback={feedback}
      />
      <CommentList
        feedbackId={feedback}
        className={styles["feedback__comments"]}
      />
      <AddComment className={styles["feedback__add-comment"]} />
    </div>
  );
}
