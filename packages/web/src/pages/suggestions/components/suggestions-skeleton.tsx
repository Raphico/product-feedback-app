import { cn } from "@/lib/utils";
import styles from "./suggestions-skeleton.module.css";
import Skeleton from "@/components/skeleton";

function SuggestionsSkeleton({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(styles["suggestions-skeleton"], className)}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}

export default SuggestionsSkeleton;
