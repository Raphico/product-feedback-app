import { Feedback } from "@/features/feedbacks/types";
import FeedbackItem from "@/features/feedbacks/components/feedback-item";
import styles from "./suggestion-list.module.css";
import { cn } from "@/lib/utils";

interface SuggestionListProps extends React.HTMLAttributes<HTMLElement> {
  suggestions: Feedback[];
}

function SuggestionList({ suggestions, className }: SuggestionListProps) {
  return (
    <article className={cn(styles["suggestion-list"], className)}>
      <h2 className="sr-only">suggestions</h2>
      {suggestions.map((suggestion) => (
        <FeedbackItem key={suggestion.id} feedback={suggestion} />
      ))}
    </article>
  );
}

export default SuggestionList;
