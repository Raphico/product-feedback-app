import GoBack from "@/components/go-back";
import IconNewFeedback from "@/assets/icon-new-feedback.svg?react";
import styles from "./index.module.css";
import CreateFeedbackForm from "./components/create-feedback-form";

function CreateFeedbackPage() {
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
        <CreateFeedbackForm />
      </div>
    </div>
  );
}

export default CreateFeedbackPage;
