import { Button } from "@/components/button";
import {
  useDeleteFeedbackMutation,
  useUpdateFeedbackMutation,
} from "@/features/feedbacks/service";
import type { Feedback } from "@/features/feedbacks/types";
import { useAppForm } from "@/lib/form";
import { showErrorToast } from "@/utils/error";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import styles from "./edit-feedback-form.module.css";
import Spinner from "@/components/spinner";
import { Form, FormDescription, FormItem, FormLabel } from "@/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { cn } from "@/lib/utils";
import {
  FeedbackCategories,
  feedbackCategoryOptions,
  FeedbackStatuses,
  feedbackStatusOptions,
} from "@/config";
import { editFeedbackSchema } from "@/features/feedbacks/validations";

interface EditFeedbackFormProps {
  feedback: Feedback;
  isAdmin: boolean;
  isAuthor: boolean;
}

function EditFeedbackForm({
  feedback,
  isAdmin,
  isAuthor,
}: EditFeedbackFormProps) {
  const navigate = useNavigate();
  const [updateFeedback] = useUpdateFeedbackMutation();
  const [deleteFeedback, { isLoading: isDeleting }] =
    useDeleteFeedbackMutation();

  const form = useAppForm({
    defaultValues: {
      title: feedback.title,
      category: feedback.category,
      detail: feedback.detail,
      status: feedback.status,
    },
    validators: {
      onSubmit: editFeedbackSchema,
    },
    async onSubmit({ value }) {
      try {
        const { status, ...fields } = value;

        const payload =
          isAdmin && !isAuthor
            ? { status, id: feedback.id }
            : isAuthor && !isAdmin
              ? { ...fields, id: feedback.id }
              : { ...fields, status, id: feedback.id };

        await updateFeedback(payload).unwrap();
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
    <Form
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormItem>
        <FormLabel
          htmlFor="title"
          className={styles["edit-feedback-form__label"]}
        >
          Feedback Title
        </FormLabel>
        <FormDescription>Add a short, descriptive headline</FormDescription>
        <form.AppField
          name="title"
          children={(field) => (
            <>
              <field.FormInput
                disabled={!isAuthor}
                className={styles["edit-feedback-form__input"]}
                id="title"
                type="text"
                name="title"
              />
              <field.FormFieldError />
            </>
          )}
        />
      </FormItem>

      <FormItem>
        <FormLabel
          htmlFor="category"
          className={styles["edit-feedback-form__label"]}
        >
          Category
        </FormLabel>
        <FormDescription>Choose a category for your feedback</FormDescription>
        <form.AppField
          name="category"
          children={(field) => (
            <>
              <Select
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as FeedbackCategories)
                }
              >
                <SelectTrigger
                  disabled={!isAuthor}
                  className={cn(
                    styles["edit-feedback-form__input"],
                    styles["edit-feedback-form__select"],
                  )}
                  id="category"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {feedbackCategoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <field.FormFieldError />
            </>
          )}
        />
      </FormItem>

      {isAdmin && (
        <FormItem>
          <FormLabel
            htmlFor="status"
            className={styles["edit-feedback-form__label"]}
          >
            Update Status
          </FormLabel>
          <FormDescription>Change feature state</FormDescription>
          <form.AppField
            name="status"
            children={(field) => (
              <>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as FeedbackStatuses)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      styles["edit-feedback-form__input"],
                      styles["edit-feedback-form__select"],
                    )}
                    id="status"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <field.FormFieldError />
              </>
            )}
          />
        </FormItem>
      )}

      <FormItem>
        <FormLabel
          htmlFor="detail"
          className={styles["edit-feedback-form__label"]}
        >
          Feedback Detail
        </FormLabel>
        <FormDescription>
          Include any specific comments on what should be improved, added, etc.
        </FormDescription>
        <form.AppField
          name="detail"
          children={(field) => (
            <>
              <field.FormTextarea
                disabled={!isAuthor}
                className={styles["edit-feedback-form__input"]}
                id="detail"
                name="detail"
              />
              <field.FormFieldError />
            </>
          )}
        />
      </FormItem>

      <div className={styles["edit-edit-feedback-form__actions"]}>
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
    </Form>
  );
}

export default EditFeedbackForm;
