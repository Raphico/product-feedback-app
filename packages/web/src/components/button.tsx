import { cn } from "@/lib/utils";
import styles from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variants: Variants;
}

type Variants = "primary" | "secondary" | "destructive" | "tertiary";

const buttonVariants = Object.fromEntries(
  Object.entries({
    primary: styles["primary"],
    secondary: styles["secondary"],
    destructive: styles["destructive"],
    tertiary: styles["tertiary"],
  }).map(([key, value]) => [key, cn(styles["button"], value)]),
) as Record<Variants, string>;

function Button({ className, children, variants, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants[variants], className)} {...props}>
      {children}
    </button>
  );
}

export { Button, buttonVariants };
