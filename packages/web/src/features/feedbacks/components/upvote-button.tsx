import IconArrowUp from "@/assets/icon-arrow-up.svg?react";
import styles from "./upvote-button.module.css";
import { cn } from "@/lib/utils";

interface UpvoteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  upvotes: number;
  hasUpvote: boolean;
}

function UpvoteButton({
  hasUpvote,
  upvotes,
  className,
  ...props
}: UpvoteButtonProps) {
  return (
    <button
      aria-label="upvote"
      className={cn(
        styles["upvote-button"],
        hasUpvote && styles["has-upvote"],
        className,
      )}
      {...props}
    >
      <IconArrowUp className={styles["upvote-button__icon"]} />
      {upvotes} <span className="sr-only">total upvotes</span>
    </button>
  );
}

export default UpvoteButton;
