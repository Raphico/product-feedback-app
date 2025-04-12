import GoBack from "@/components/go-back";
import styles from "./index.module.css";
import IconEditFeedback from "@/assets/icon-edit-feedback.svg?react";
import FeedbackForm from "../../components/feedback-form";
import { getRouteApi } from "@tanstack/react-router";
import {
  useDeleteFeedbackMutation,
  useGetFeedbackQuery,
  useUpdateFeedbackMutation,
} from "../../service";
import { useAppForm } from "@/lib/form";
import { feedbackSchema } from "../../validations";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { getErrorMessage, showErrorToast } from "@/utils/error";
import NotFound from "@/components/not-found";
import { Button } from "@/components/button";
import Spinner from "@/components/spinner";
import { FeedbackCategories } from "@/config";
import Skeleton from "@/components/skeleton";
import { useEffect } from "react";

const routeApi = getRouteApi("/feedback_/$feedbackId/edit");

function EditFeedbackPage() {
  const navigate = useNavigate();
  const { feedbackId } = routeApi.useParams();

  const {
    data: feedback,
    isLoading: isLoadingFeedback,
    error: feedbackError,
  } = useGetFeedbackQuery(feedbackId);

  const [updateFeedback] = useUpdateFeedbackMutation();
  const [deleteFeedback, { isLoading: isDeleting }] =
    useDeleteFeedbackMutation();

  const form = useAppForm({
    defaultValues: {
      title: feedback?.title ?? "",
      category: feedback?.category ?? FeedbackCategories.UI,
      detail: feedback?.detail ?? "",
    },
    validators: {
      onSubmit: feedbackSchema,
    },
    async onSubmit({ value }) {
      try {
        await updateFeedback({ ...value, id: feedbackId }).unwrap();
        toast.success("Feedback updated. Thanks for keeping it fresh!");
        navigate({ to: "/" });
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
  });

  useEffect(() => {
    if (feedbackError) {
      showErrorToast(feedbackError);
    }
  }, [feedbackError]);

  async function handleDeleteFeedback() {
    try {
      await deleteFeedback(feedbackId).unwrap();
      toast.success("Feedback deleted.");
      navigate({ to: "/" });
    } catch (error) {
      showErrorToast(error);
    }
  }

  if (!isLoadingFeedback && !feedback) {
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

        <div aria-live="polite" className="sr-only">
          {isLoadingFeedback ? <p>Loading feedback</p> : <p>Feedback Loaded</p>}
        </div>

        {isLoadingFeedback ? (
          <Skeleton className={styles["edit-feedback__skeleton"]} />
        ) : feedback ? (
          <>
            <h1 className={styles["edit-feedback__header"]}>
              Editing '{feedback.title}'
            </h1>

            <FeedbackForm form={form}>
              <div className={styles["edit-feedback__actions"]}>
                <form.AppForm>
                  <form.SubscribeButton
                    className={styles["create-feedback__action"]}
                  >
                    Save Changes
                  </form.SubscribeButton>
                </form.AppForm>

                <Button
                  disabled={isDeleting}
                  aria-label="Delete Feedback"
                  type="button"
                  variants="destructive"
                  onClick={handleDeleteFeedback}
                >
                  {isDeleting ? <Spinner /> : "Delete"}
                </Button>
              </div>
            </FeedbackForm>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default EditFeedbackPage;
