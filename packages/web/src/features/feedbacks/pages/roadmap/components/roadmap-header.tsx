import GoBack from "@/components/go-back";
import styles from "./roadmap-header.module.css";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

function RoadmapHeader({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header className={cn(styles["roadmap-header"], className)}>
      <GoBack to="/" className={styles["roadmap-header__go-back"]} />
      <h1 className={cn("h1", styles["roadmap-header__title"])}>Roadmap</h1>
      <Button
        variants="primary"
        className={styles["roadmap-header__add-feedback"]}
      >
        + Add Feedback
      </Button>
    </header>
  );
}

export default RoadmapHeader;
