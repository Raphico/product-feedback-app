import IconSuggestions from "@/assets/icon-suggestions.svg?react";
import IconPlus from "@/assets/icon-plus.svg?react";
import styles from "./suggestions-header.module.css";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/button";
import { cn } from "@/lib/utils";

interface SuggestionsHeaderProps {
  totalSuggestions: number;
}

function SuggestionsHeader({ totalSuggestions }: SuggestionsHeaderProps) {
  return (
    <header className={styles["suggestions-header"]}>
      <p className={cn("h3", styles["suggestions-header__total-suggestions"])}>
        <IconSuggestions />
        {totalSuggestions} suggestions
      </p>
      <Link to="." className={buttonVariants.primary}>
        <IconPlus /> Add Feedback
      </Link>
    </header>
  );
}

export default SuggestionsHeader;
