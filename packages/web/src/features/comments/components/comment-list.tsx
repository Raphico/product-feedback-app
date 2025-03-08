import { cn } from "@/lib/utils";
import styles from "./comment-list.module.css";
import type { Feedback } from "@/features/feedbacks/types";
import { useFeedbackComments } from "../hooks";
import CommentListItem from "./comment-list-item";

interface CommentListProps extends React.ComponentProps<"article"> {
  feedbackId: Feedback["id"];
}

function CommentList({ feedbackId, className }: CommentListProps) {
  const comments = useFeedbackComments(feedbackId);

  return (
    <article className={cn(styles["comments"], className)}>
      <h2 className="h3">{comments.length} Comments</h2>
      <div className={styles["comments__list"]}>
        {comments.map((comment) => (
          <CommentListItem key={comment.id} comment={comment} />
        ))}
      </div>
    </article>
  );
}

export default CommentList;
