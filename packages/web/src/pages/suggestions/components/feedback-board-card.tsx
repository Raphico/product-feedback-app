import { cn } from "@/lib/utils";
import styles from "./feedback-board-card.module.css";

function FeedbackBoardCard({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn(styles["board-card"], className)}>
      <h1 className="h2">
        Frontend Mentor <span className="body-2">Feedback Board</span>
      </h1>
    </div>
  );
}

export default FeedbackBoardCard;
