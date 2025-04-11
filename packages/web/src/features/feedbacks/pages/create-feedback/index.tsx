import GoBack from "@/components/go-back";
import IconNewFeedback from "@/assets/icon-new-feedback.svg?react";
import FeedbackForm from "../../components/feedback-form";
import styles from "./index.module.css";
import { useAppForm } from "@/lib/form";
import { feedbackSchema } from "../../validation";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { useCreateFeedbackMutation } from "../../service";
import { FeedbackCategories } from "@/config";
import { useNavigate } from "@tanstack/react-router";

function CreateFeedbackPage() {
  const navigate = useNavigate();
  const [createFeedback] = useCreateFeedbackMutation();

  const form = useAppForm({
    defaultValues: {
      title: "",
      category: FeedbackCategories.UI,
      detail: "",
    },
    validators: {
      onSubmit: feedbackSchema,
    },
    async onSubmit({ value }) {
      try {
        await createFeedback(value).unwrap();
        toast.success("Thanks for the feedback!");
        navigate({
          to: "/",
        });
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
  });

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
        <FeedbackForm form={form}>
          <form.AppForm>
            <form.SubscribeButton className={styles["create-feedback__action"]}>
              Add Feedback
            </form.SubscribeButton>
          </form.AppForm>
        </FeedbackForm>
      </div>
    </div>
  );
}

export default CreateFeedbackPage;
