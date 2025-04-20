import styles from "./go-back.module.css";
import IconArrowLeft from "@/assets/icon-arrow-left.svg?react";
import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";

function GoBack({ className }: React.HTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();

  return (
    <button
      aria-label="Go back to previous page"
      className={cn(styles["go-back"], className)}
      onClick={() => router.history.back()}
    >
      <IconArrowLeft className={styles["go-back__icon"]} />
      Go Back
    </button>
  );
}

export default GoBack;
