import IconSuggestions from "@/assets/icon-suggestions.svg?react";
import IconPlus from "@/assets/icon-plus.svg?react";
import styles from "./suggestions-header.module.css";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/button";
import { cn } from "@/lib/utils";
import SuggestionsSort from "./suggestions-sort";

interface SuggestionsHeaderProps extends React.HTMLAttributes<HTMLElement> {
  totalSuggestions: number;
}

function SuggestionsHeader({
  totalSuggestions,
  className,
}: SuggestionsHeaderProps) {
  return (
    <header className={cn(styles["suggestions-header"], className)}>
      <h2 className={cn("h3", styles["suggestions-header__total-suggestions"])}>
        <IconSuggestions />
        {totalSuggestions} suggestions
      </h2>
      <SuggestionsSort />
      <Link
        to="."
        className={cn(
          styles["suggestions-header__link"],
          buttonVariants.primary,
        )}
      >
        <IconPlus /> Add Feedback
      </Link>
    </header>
  );
}

export default SuggestionsHeader;
