import { feedbackCategoryOptions } from "@/config";
import styles from "./suggestions-filter.module.css";
import { cn } from "@/lib/utils";
import { getRouteApi, Link } from "@tanstack/react-router";

const routeApi = getRouteApi("/");

function SuggestionsFilter() {
  const { category } = routeApi.useSearch();

  return (
    <section className={styles["filters-container"]}>
      <h2 id="heading" className="sr-only">
        Filter suggestions
      </h2>
      <menu aria-labelledby="heading" className={styles["filters"]}>
        <Link
          to="."
          className={cn("body-3", !category && styles["current"])}
          search={{}}
        >
          All
        </Link>
        {feedbackCategoryOptions.map((option) => (
          <Link
            key={option.value}
            to="."
            search={{ category: option.value }}
            className={cn(
              "body-3",
              category === option.value && styles["current"],
            )}
          >
            {option.label}
          </Link>
        ))}
      </menu>
    </section>
  );
}

export default SuggestionsFilter;
