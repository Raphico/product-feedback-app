import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import styles from "./suggestions-sort.module.css";
import { cn } from "@/lib/utils";

function SuggestionsSort() {
  const options = [
    { label: "Most Upvotes", value: "most_upvotes" },
    { label: "Least Upvotes", value: "least_upvotes" },
    { label: "Most Comments", value: "most_comments" },
    { label: "Least Comments", value: "least_comments" },
  ];

  return (
    <Select
      defaultValue="most_upvotes"
      onValueChange={(value: string) => console.log(value)}
    >
      <SelectTrigger className={cn("h4", styles["sort-button"])}>
        <span className={styles["sort-button__text"]}>Sort by:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent sideOffset={45}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SuggestionsSort;
