import { cn } from "@/lib/utils";
import styles from "./comment-list.module.css";
import { Comment } from "../types";
import CommentListItem from "./comment-list-item";

interface CommentListProps extends React.ComponentProps<"article"> {
  comments: Comment[];
}

function CommentList({ comments, className }: CommentListProps) {
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
