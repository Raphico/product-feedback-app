import { cn } from "@/lib/utils";
import styles from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variants: Variants;
  size?: Size;
}

type Variants = "primary" | "secondary" | "destructive" | "tertiary";
type Size = "default" | "lg";

const buttonVariants = Object.fromEntries(
  Object.entries({
    primary: styles["primary"],
    secondary: styles["secondary"],
    destructive: styles["destructive"],
    tertiary: styles["tertiary"],
  }).map(([key, value]) => [key, cn(styles["button"], value)]),
) as Record<Variants, string>;

function Button({
  className,
  children,
  size = "default",
  variants,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants[variants], styles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button, buttonVariants };
