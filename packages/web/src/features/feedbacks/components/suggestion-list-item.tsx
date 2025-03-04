import Badge from "@/components/badge";
import TotalComments from "@/components/total-comments";
import UpvoteButton from "@/components/upvote-button";
import styles from "./suggestion-list-item.module.css";
import type { Feedback } from "@/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

function SuggestionListItem({ suggestion }: { suggestion: Feedback }) {
  return (
    <Link to=".">
      <article className={styles["suggestion"]}>
        <h3 className={cn("h3", styles["suggestion__header"])}>
          {suggestion.title}
        </h3>
        <p className={styles["suggestion__desc"]}>{suggestion.description}</p>
        <Badge className={styles["suggestion__category"]}>
          {suggestion.category}
        </Badge>
        <UpvoteButton
          className={styles["suggestion__upvote-button"]}
          upvotes={suggestion.upvotes}
        />
        <TotalComments
          className={styles["suggestion__total-comments"]}
          total={suggestion.comments.length}
        />
      </article>
    </Link>
  );
}

export default SuggestionListItem;
