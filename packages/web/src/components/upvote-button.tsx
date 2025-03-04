import IconArrowUp from "@/assets/icon-arrow-up.svg?react";
import styles from "./upvote-button.module.css";
import { cn } from "@/lib/utils";

interface UpvoteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  upvotes: number;
}

function UpvoteButton({ upvotes, className, ...props }: UpvoteButtonProps) {
  return (
    <button
      aria-label="upvote"
      className={cn(styles["upvote-button"], className)}
      {...props}
    >
      <IconArrowUp />
      {upvotes} <span className="sr-only">total upvotes</span>
    </button>
  );
}

export default UpvoteButton;
