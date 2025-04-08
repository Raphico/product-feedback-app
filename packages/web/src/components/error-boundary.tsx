import { Link } from "@tanstack/react-router";
import { Component, ErrorInfo } from "react";
import { buttonVariants } from "./button";
import IllustrationError from "@/assets/illustration-error.svg?react";
import styles from "./error-boundary.module.css";
import { cn } from "@/lib/utils";

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={styles["error-container"]}>
          <section className={styles["error-card"]}>
            <IllustrationError />
            <h1 className={cn("h1", styles["error-card__title"])}>Oops!</h1>
            <p className={styles["error-card__desc"]}>
              It looks like something unexpected happened. We're working to fix
              it as quickly as possible. Please try again later, or refresh the
              page if needed
            </p>
            <Link to="/" className={buttonVariants["primary"]}>
              Visit home
            </Link>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}
