import styles from "./skeleton.module.css";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles["skeleton"], className)} {...props} />;
}

export default Skeleton;
