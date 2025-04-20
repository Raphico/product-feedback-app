import IconArrowUp from "@/assets/icon-arrow-up.svg?react";
import styles from "./upvote-button.module.css";
import { cn } from "@/lib/utils";
import { useIsLoggedIn } from "@/features/user/hooks";
import { useNavigate } from "@tanstack/react-router";
import { useToggleUpvoteMutation } from "../service";
import { showErrorToast } from "@/utils/error";

interface UpvoteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  upvotes: number;
  hasUpvote: boolean;
  upvoteRedirectContext: string;
  feedbackId: string;
}

function UpvoteButton({
  hasUpvote,
  upvotes,
  className,
  upvoteRedirectContext,
  feedbackId,
  ...props
}: UpvoteButtonProps) {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const [toggleUpvote] = useToggleUpvoteMutation();

  async function handleUpvote() {
    if (!isLoggedIn) {
      navigate({
        to: "/login",
        search: {
          redirectTo: upvoteRedirectContext,
        },
      });
      return;
    }

    try {
      await toggleUpvote(feedbackId).unwrap();
    } catch (error) {
      showErrorToast(error);
    }
  }

  return (
    <button
      aria-label="upvote"
      className={cn(
        styles["upvote-button"],
        hasUpvote && styles["has-upvote"],
        className,
      )}
      onClick={handleUpvote}
      {...props}
    >
      <IconArrowUp className={styles["upvote-button__icon"]} />
      {upvotes} <span className="sr-only">total upvotes</span>
    </button>
  );
}

export default UpvoteButton;
