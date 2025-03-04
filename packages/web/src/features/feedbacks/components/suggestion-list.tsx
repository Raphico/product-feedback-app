import { Feedback } from "@/types";
import SuggestionListItem from "./suggestion-list-item";
import styles from "./suggestion-list.module.css";

interface SuggestionListProps {
  suggestions: Feedback[];
}

function SuggestionList({ suggestions }: SuggestionListProps) {
  return (
    <article className={styles["suggestion-list"]}>
      <h2 className="sr-only">suggestions</h2>
      {suggestions.map((suggestion) => (
        <SuggestionListItem key={suggestion.id} suggestion={suggestion} />
      ))}
    </article>
  );
}

export default SuggestionList;
