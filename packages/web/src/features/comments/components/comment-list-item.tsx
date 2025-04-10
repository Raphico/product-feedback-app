import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import styles from "./comment-list-item.module.css";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ReplyForm from "./reply-form";
import { Comment } from "../types";
import { useIsLoggedIn } from "@/features/user/hooks";
import { useNavigate } from "@tanstack/react-router";

interface CommentListItemProps extends React.ComponentProps<"article"> {
  comment: Comment;
  parentComment?: {
    id: string;
    username: string;
  };
}

function CommentListItem({ comment, parentComment }: CommentListItemProps) {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const initials = comment.createdBy.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  function handleReplyClick() {
    if (isLoggedIn) {
      setShowReplyForm(true);
      return;
    }

    navigate({
      to: "/login",
      search: { redirectTo: `/feedback/${comment.feedbackId}` },
    });
  }

  return (
    <article
      className={cn(styles["comment"], {
        [styles["comment__top-level"]]: !parentComment,
      })}
    >
      <Avatar>
        <AvatarImage
          src={comment.createdBy.avatar}
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
        onClick={handleReplyClick}
        className={styles["comment__reply-button"]}
      >
        Reply
      </button>
      <p className={styles["comment__content"]}>
        <span className={styles["comment__at"]}>
          {parentComment && `@${parentComment.username}`}
        </span>{" "}
        {comment.content}
      </p>
      {showReplyForm && (
        <ReplyForm
          className={styles["comment__reply-form"]}
          closeForm={() => setShowReplyForm(false)}
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
