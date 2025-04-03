import IllustrationEmpty from "@/assets/illustration-empty.svg?react";
import styles from "./index.module.css";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/button";

interface NotFoundPageProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  link: string;
  linkText: string;
}

function NotFoundPage({
  title,
  description,
  link,
  linkText,
  className,
}: NotFoundPageProps) {
  return (
    <div className={styles["card-container"]}>
      <section className={cn(styles["card"], className)}>
        <IllustrationEmpty />
        <h2 className={cn("h1", styles["card__title"])}>{title}</h2>
        <p className={styles["card__description"]}>{description}</p>
        <Link to={link} className={buttonVariants["primary"]}>
          {linkText}
        </Link>
      </section>
    </div>
  );
}

export default NotFoundPage;
