import { Form, FormDescription, FormItem, FormLabel } from "@/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import styles from "./feedback-form.module.css";
import { cn } from "@/lib/utils";
import { FeedbackCategories, feedbackCategoryOptions } from "@/config";
import { withForm } from "@/lib/form";

const FeedbackForm = withForm({
  defaultValues: {
    title: "",
    detail: "",
    category: FeedbackCategories.UI,
  },
  render: function Render({ form, children, ...props }) {
    return (
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        {...props}
      >
        <FormItem>
          <FormLabel htmlFor="title">Feedback Title</FormLabel>
          <FormDescription>Add a short, descriptive headline</FormDescription>
          <form.AppField
            name="title"
            children={(field) => (
              <>
                <field.FormInput
                  className={styles["feedback-form__input"]}
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
          <FormLabel htmlFor="category">Category</FormLabel>
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
                      styles["feedback-form__input"],
                      styles["feedback-form__category"],
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
        <FormItem>
          <FormLabel htmlFor="detail">Feedback Detail</FormLabel>
          <FormDescription>
            Include any specific comments on what should be improved, added,
            etc.
          </FormDescription>
          <form.AppField
            name="detail"
            children={(field) => (
              <>
                <field.FormTextarea
                  className={styles["feedback-form__input"]}
                  id="detail"
                  name="detail"
                />
                <field.FormFieldError />
              </>
            )}
          />
        </FormItem>
        {children}
      </Form>
    );
  },
});

export default FeedbackForm;
