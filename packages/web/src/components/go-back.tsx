import styles from "./go-back.module.css";
import IconArrowLeft from "@/assets/icon-arrow-left.svg?react";
import { cn } from "@/lib/utils";
import { useNavigate, useRouter } from "@tanstack/react-router";

interface GoBackProps extends React.HTMLAttributes<HTMLButtonElement> {
  to?: string;
}

function GoBack({ className, to }: GoBackProps) {
  const router = useRouter();
  const navigate = useNavigate();

  function handleNavigation() {
    if (to) {
      navigate({ to });
    } else {
      router.history.back();
    }
  }

  return (
    <button
      aria-label="Go back to previous page"
      className={cn(styles["go-back"], className)}
      onClick={handleNavigation}
    >
      <IconArrowLeft className={styles["go-back__icon"]} />
      Go Back
    </button>
  );
}

export default GoBack;
