import { cn } from "@/lib/utils";
import styles from "./spinner.module.css";

function Spinner({ className }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn(styles["spinner"], className)}></span>;
}

export default Spinner;
