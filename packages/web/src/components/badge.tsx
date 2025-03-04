import { type HTMLAttributes } from "react";
import styles from "./badge.module.css";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {}

function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <div className={cn(styles.badge, className)} {...props}>
      {children}
    </div>
  );
}

export default Badge;
