import { Button } from "@/components/button";
import FeedbackForm from "@/features/feedbacks/components/feedback-form";
import {
  useDeleteFeedbackMutation,
  useUpdateFeedbackMutation,
} from "@/features/feedbacks/service";
import type { Feedback } from "@/features/feedbacks/types";
import { feedbackSchema } from "@/features/feedbacks/validations";
import { useAppForm } from "@/lib/form";
import { showErrorToast } from "@/utils/error";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import styles from "./edit-feedback-form.module.css";
import Spinner from "@/components/spinner";

interface EditFeedbackFormProps {
  feedback: Feedback;
}

function EditFeedbackForm({ feedback }: EditFeedbackFormProps) {
  const navigate = useNavigate();
  const [updateFeedback] = useUpdateFeedbackMutation();
  const [deleteFeedback, { isLoading: isDeleting }] =
    useDeleteFeedbackMutation();

  const form = useAppForm({
    defaultValues: {
      title: feedback.title,
      category: feedback.category,
      detail: feedback.detail,
    },
    validators: {
      onSubmit: feedbackSchema,
    },
    async onSubmit({ value }) {
      try {
        await updateFeedback({ ...value, id: feedback.id }).unwrap();
        toast.success("Feedback updated. Thanks for keeping it fresh!");
        navigate({
          to: `/feedback/$feedbackId`,
          params: { feedbackId: feedback.id },
        });
      } catch (error) {
        showErrorToast(error);
      }
    },
  });

  async function handleDeleteFeedback() {
    try {
      await deleteFeedback(feedback.id).unwrap();
      toast.success("Feedback deleted.");
      navigate({ to: "/" });
    } catch (error) {
      showErrorToast(error);
    }
  }

  return (
    <FeedbackForm form={form}>
      <div className={styles["edit-feedback-form__actions"]}>
        <form.AppForm>
          <form.SubscribeButton>Save Changes</form.SubscribeButton>
        </form.AppForm>

        <Button
          disabled={isDeleting}
          aria-label="Delete Feedback"
          type="button"
          size="lg"
          variants="destructive"
          onClick={handleDeleteFeedback}
        >
          {isDeleting ? <Spinner /> : "Delete"}
        </Button>
      </div>
    </FeedbackForm>
  );
}

export default EditFeedbackForm;
