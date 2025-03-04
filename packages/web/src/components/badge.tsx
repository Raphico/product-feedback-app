import styles from "./badge.module.css";
import { cn } from "@/lib/utils";

function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(styles.badge, className)} {...props}>
      {children}
    </div>
  );
}

export default Badge;
