import { cn } from "@/lib/utils";
import styles from "./comment-list.module.css";
import type { Feedback } from "@/features/feedbacks/types";
import CommentListItem from "./comment-list-item";
import { CommentWithReplies } from "../types";

interface CommentListProps extends React.ComponentProps<"article"> {
  feedbackId: Feedback["id"];
}

function CommentList({ className }: CommentListProps) {
  const comments: CommentWithReplies[] = [];

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
