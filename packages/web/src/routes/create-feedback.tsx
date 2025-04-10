import { createFileRoute } from "@tanstack/react-router";
import IconNewFeedback from "@/assets/icon-new-feedback.svg?react";
import styles from "./create-feedback.module.css";
import GoBack from "@/components/go-back";
import FeedbackForm from "@/features/feedbacks/components/feedback-form";
import { Button } from "@/components/button";

export const Route = createFileRoute("/create-feedback")({
  component: CreateFeedback,
});

function CreateFeedback() {
  return (
    <div className={styles["create-feedback"]}>
      <GoBack />
      <div className={styles["create-feedback__card"]}>
        <div className={styles["create-feedback__decoration"]}>
          <IconNewFeedback />
        </div>
        <h1 className={styles["create-feedback__header"]}>
          Create New Feedback
        </h1>
        <FeedbackForm>
          <Button
            className={styles["create-feedback__action"]}
            size="lg"
            type="submit"
            variants="primary"
          >
            Add Feedback
          </Button>
        </FeedbackForm>
      </div>
    </div>
  );
}
