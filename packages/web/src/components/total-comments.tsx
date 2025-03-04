import IconComments from "@/assets/icon-comments.svg?react";
import styles from "./total-comments.module.css";
import { cn } from "@/lib/utils";

interface TotalCommentsProps extends React.HTMLProps<HTMLDivElement> {
  total: number;
}

function TotalComments({ className, total, ...props }: TotalCommentsProps) {
  return (
    <div className={cn(styles["total-comments"], className)} {...props}>
      <IconComments />
      <p>
        {total} <span className="sr-only">comments</span>
      </p>
    </div>
  );
}

export default TotalComments;
