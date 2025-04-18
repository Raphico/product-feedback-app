import { cn } from "@/lib/utils";
import styles from "./card.module.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

function Card({ className, as: Comp = "section", ...props }: CardProps) {
  return <Comp className={cn(styles["card"], className)} {...props} />;
}

Card.displayName = "Card";

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn(styles["card__header"], className)} {...props} />;
}

CardHeader.displayName = "CardHeader";

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

function CardTitle({ className, ...props }: CardTitleProps) {
  return <h2 className={cn(styles["card__title"], className)} {...props} />;
}

CardTitle.displayName = "CardTitle";

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p className={cn(styles["card__description"], className)} {...props} />
  );
}

CardDescription.displayName = "CardDescription";

type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

function CardBody({ className, ...props }: CardBodyProps) {
  return <div className={cn(styles["card__body"], className)} {...props} />;
}

CardBody.displayName = "CardBody";

type CardSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

function CardSeparator({ className, ...props }: CardSeparatorProps) {
  return (
    <div className={cn(styles["card__separator"], className)} {...props} />
  );
}

CardSeparator.displayName = "CardSeparator";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardSeparator,
};
