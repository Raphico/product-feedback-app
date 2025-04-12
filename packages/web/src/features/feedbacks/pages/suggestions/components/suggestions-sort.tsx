import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import styles from "./suggestions-sort.module.css";
import { cn } from "@/lib/utils";
import { FeedbackSortOptions, feedbackSortOptions } from "@/config";
import { useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/");

function SuggestionsSort() {
  const router = useRouter();
  const { sort } = routeApi.useSearch();

  function handleSort(value: FeedbackSortOptions) {
    router.navigate({
      to: ".",
      search: { sort: value },
    });
  }

  return (
    <Select
      value={sort ?? FeedbackSortOptions.MOST_UPVOTES}
      onValueChange={(value: string) =>
        handleSort(value as FeedbackSortOptions)
      }
    >
      <SelectTrigger className={cn("h4", styles["sort-button"])}>
        <span className={styles["sort-button__text"]}>Sort by:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent sideOffset={45}>
        {feedbackSortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SuggestionsSort;
