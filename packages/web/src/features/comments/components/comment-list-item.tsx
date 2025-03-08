import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import type { CommentWithReplies } from "../types";
import styles from "./comment-list-item.module.css";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ReplyForm from "./reply-form";

interface CommentListItemProps extends React.ComponentProps<"article"> {
  comment: CommentWithReplies;
  parentComment?: {
    id: string;
    username: string;
  };
}

function CommentListItem({ comment, parentComment }: CommentListItemProps) {
  const [showReply, setShowReply] = useState(false);
  const initials = comment.createdBy.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <article
      className={cn(styles["comment"], {
        [styles["with-replies"]]: comment.replies.length > 0,
      })}
    >
      <Avatar>
        <AvatarImage
          src={comment.createdBy.image}
          alt={`${comment.createdBy.fullName} profile image`}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className={styles["comment__user"]}>
        <strong className={styles["comment__fullName"]}>
          {comment.createdBy.fullName}
        </strong>
        <span className={styles["comment__username"]}>
          @{comment.createdBy.username}
        </span>
      </div>
      <button
        onClick={() => setShowReply(true)}
        className={styles["comment__reply"]}
      >
        Reply
      </button>
      <p className={styles["comment__content"]}>
        <span className={styles["comment__at"]}>
          {parentComment && `@${parentComment.username}`}
        </span>{" "}
        {comment.content}
      </p>
      {showReply && (
        <ReplyForm
          className={styles["comment__reply-form"]}
          closeForm={() => setShowReply(false)}
        />
      )}
      {comment.replies.length > 0 && (
        <div className={styles["comment__replies"]}>
          {comment.replies.map((reply) => (
            <CommentListItem
              key={reply.id}
              comment={reply}
              parentComment={{
                id: comment.id,
                username: comment.createdBy.username,
              }}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default CommentListItem;
