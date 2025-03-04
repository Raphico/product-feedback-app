import { feedbackCategories } from "@/config";
import styles from "./suggestions-filter.module.css";
import { cn } from "@/lib/utils";

function SuggestionsFilter() {
  return (
    <section className={styles["filters-container"]}>
      <h2 id="heading" className="sr-only">
        Filter suggestions
      </h2>
      <menu aria-labelledby="heading" className={styles["filters"]}>
        {feedbackCategories.map((category) => (
          <li key={category}>
            <button
              className={cn("body-3", category == "All" && styles["current"])}
            >
              {category}
            </button>
          </li>
        ))}
      </menu>
    </section>
  );
}

export default SuggestionsFilter;
