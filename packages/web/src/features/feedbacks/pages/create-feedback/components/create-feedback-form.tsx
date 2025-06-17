import { Form, FormDescription, FormItem, FormLabel } from "@/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { cn } from "@/lib/utils";
import { feedbackCategoryOptions } from "@/config";
import { useAppForm } from "@/lib/form";
import { toast } from "sonner";
import { showErrorToast } from "@/utils/error";
import { useCreateFeedbackMutation } from "@/features/feedbacks/service";
import { FeedbackCategories } from "@/config";
import { useNavigate } from "@tanstack/react-router";
import { createFeedbackSchema } from "@/features/feedbacks/validations";
import styles from "./create-feedback-form.module.css";

function CreateFeedbackForm() {
  const navigate = useNavigate();
  const [createFeedback] = useCreateFeedbackMutation();

  const form = useAppForm({
    defaultValues: {
      title: "",
      category: FeedbackCategories.UI,
      detail: "",
    },
    validators: {
      onSubmit: createFeedbackSchema,
    },
    async onSubmit({ value }) {
      try {
        await createFeedback(value).unwrap();
        toast.success("Thanks for the feedback!");
        navigate({
          to: "/",
        });
      } catch (error) {
        showErrorToast(error);
      }
    },
  });

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
          className={styles["create-feedback-form__label"]}
        >
          Feedback Title
        </FormLabel>
        <FormDescription>Add a short, descriptive headline</FormDescription>
        <form.AppField
          name="title"
          children={(field) => (
            <>
              <field.FormInput
                className={styles["create-feedback-form__input"]}
                disabled={form.state.isSubmitting}
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
          className={styles["create-feedback-form__label"]}
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
                  className={cn(
                    styles["create-feedback-form__input"],
                    styles["create-feedback-form__select"],
                  )}
                  id="category"
                  disabled={form.state.isSubmitting}
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

      <FormItem>
        <FormLabel
          htmlFor="detail"
          className={styles["create-feedback-form__label"]}
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
                className={styles["create-feedback-form__input"]}
                id="detail"
                disabled={form.state.isSubmitting}
                name="detail"
              />
              <field.FormFieldError />
            </>
          )}
        />
      </FormItem>

      <form.AppForm>
        <form.SubscribeButton className={styles["create-feedback__button"]}>
          Add Feedback
        </form.SubscribeButton>
      </form.AppForm>
    </Form>
  );
}

export default CreateFeedbackForm;
