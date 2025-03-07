import { Feedback } from "@/types";
import SuggestionListItem from "./feedback-item";
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
        <SuggestionListItem key={suggestion.id} suggestion={suggestion} />
      ))}
    </article>
  );
}

export default SuggestionList;
