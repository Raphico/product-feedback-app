import GoBack from "@/components/go-back";
import IconEditFeedback from "@/assets/icon-edit-feedback.svg?react";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./edit.module.css";
import FeedbackForm from "@/features/feedbacks/components/feedback-form";
import { Button } from "@/components/button";
import { useFeedbackById } from "@/features/feedbacks/hooks";

export const Route = createFileRoute("/feedback/$feedbackId/edit")({
  component: UpdateFeedback,
});

function UpdateFeedback() {
  const { feedbackId } = Route.useParams();
  const feedback = useFeedbackById(feedbackId);

  if (!feedback) {
    return null;
  }

  return (
    <div className={styles["edit-feedback"]}>
      <GoBack />
      <div className={styles["edit-feedback__card"]}>
        <div className={styles["edit-feedback__decoration"]}>
          <IconEditFeedback />
        </div>
        <h1 className={styles["edit-feedback__header"]}>
          Editing '{feedback.title}'
        </h1>
        <FeedbackForm initialValue={feedback}>
          <div className={styles["edit-feedback__actions"]}>
            <Button type="submit" variants="primary">
              Save Changes
            </Button>
            <Button type="button" variants="destructive">
              Delete
            </Button>
          </div>
        </FeedbackForm>
      </div>
    </div>
  );
}
