import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import styles from "./comment-list-item.module.css";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ReplyForm from "./reply-form";
import { ThreadedComment } from "../types";
import { useIsLoggedIn } from "@/features/user/hooks";
import { useNavigate } from "@tanstack/react-router";
import IconOfficial from "@/assets/icon-official.svg?react";

interface CommentListItemProps extends React.ComponentProps<"article"> {
  comment: ThreadedComment;
  parentComment?: {
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
        [styles["has-children"]]: comment.replies.length > 0,
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
        <div className={styles["comment__user-info"]}>
          <strong className={styles["comment__fullName"]}>
            {comment.createdBy.fullName}
          </strong>
          <span className={styles["comment__username"]}>
            @{comment.createdBy.username}
          </span>
        </div>
        {comment.createdBy.role == "admin" && (
          <div className={styles["comment__official-container"]}>
            <IconOfficial className={styles["comment__official"]} />
          </div>
        )}
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
          feedbackId={comment.feedbackId}
          parentId={comment.id}
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
