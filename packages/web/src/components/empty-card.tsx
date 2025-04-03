import IllustrationEmpty from "@/assets/illustration-empty.svg?react";
import styles from "./empty-card.module.css";
import { cn } from "@/lib/utils";

interface EmptyCardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

function EmptyCard({
  title,
  description,
  children,
  className,
}: EmptyCardCardProps) {
  return (
    <section className={cn(styles["empty-card"], className)}>
      <IllustrationEmpty />
      <h2 className={cn("h1", styles["empty-card__title"])}>{title}</h2>
      <p className={styles["empty-card__desc"]}>{description}</p>
      {children}
    </section>
  );
}

export default EmptyCard;
