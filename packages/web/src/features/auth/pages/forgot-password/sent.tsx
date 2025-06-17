import { buttonVariants } from "@/components/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { getRouteApi, Link } from "@tanstack/react-router";
import styles from "./sent.module.css";

const routeApi = getRouteApi("/_auth/forgot-password_/sent");

function SentPasswordResetEmailPage() {
  const { email } = routeApi.useSearch();

  return (
    <Card className={styles["sent"]}>
      <CardHeader>
        <CardTitle>Email Sent</CardTitle>
        <CardDescription>
          A link to reset your password has been sent to you on {email}.
        </CardDescription>
        <Link to="/login" className={buttonVariants.primary}>
          Return to login
        </Link>
      </CardHeader>
    </Card>
  );
}

export default SentPasswordResetEmailPage;
