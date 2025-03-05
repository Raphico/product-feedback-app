import { buttonVariants } from "@/components/button";
import { Link } from "@tanstack/react-router";
import IconPlus from "@/assets/icon-plus.svg?react";
import IllustrationEmpty from "@/assets/illustration-empty.svg?react";
import styles from "./empty-suggestions.module.css";
import { cn } from "@/lib/utils";

function EmptySuggestions({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn(styles["empty-suggestions"], className)}>
      <IllustrationEmpty />
      <h2 className="h1">There is no feedback yet</h2>
      <p>
        Got a suggestion? Found a bug that needs to be squashed? We love hearing
        about new ideas to improve our app.
      </p>
      <Link to="." className={buttonVariants["primary"]}>
        <IconPlus />
        Add Feedback
      </Link>
    </section>
  );
}

export default EmptySuggestions;
