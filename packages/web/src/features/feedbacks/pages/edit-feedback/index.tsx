import GoBack from "@/components/go-back";
import styles from "./index.module.css";
import IconEditFeedback from "@/assets/icon-edit-feedback.svg?react";
import { useGetFeedbackQuery } from "../../service";
import { getRouteApi } from "@tanstack/react-router";
import NotFound from "@/components/not-found";
import EditFeedbackForm from "./components/edit-feedback-form";
import Skeleton from "@/components/skeleton";

const routeApi = getRouteApi("/feedback_/$feedbackId/edit");

function EditFeedbackPage() {
  const { feedbackId } = routeApi.useParams();
  const { data: feedback, isLoading } = useGetFeedbackQuery(feedbackId);

  if (isLoading) {
    return <Skeleton className={styles["edit-feedback__skeleton"]} />;
  }

  if (!feedback) {
    return (
      <NotFound
        link="/"
        linkText="View Feedbacks"
        title="Not found"
        description="The requested feedback has either been deleted or doesn't exist."
      />
    );
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

        <EditFeedbackForm feedback={feedback} />
      </div>
    </div>
  );
}

export default EditFeedbackPage;
