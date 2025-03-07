import {
  Form,
  FormDescription,
  FormInput,
  FormItem,
  FormLabel,
  FormTextarea,
} from "@/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { feedbackCategories } from "@/config";
import styles from "./feedback-form.module.css";
import { cn } from "@/lib/utils";
import type { Feedback } from "../types";

interface FeedbackForm extends React.HTMLAttributes<HTMLFormElement> {
  initialValue?: Pick<Feedback, "title" | "category" | "description">;
}

function FeedbackForm({ initialValue, children, ...props }: FeedbackForm) {
  return (
    <Form {...props}>
      <FormItem>
        <FormLabel htmlFor="title">Feedback Title</FormLabel>
        <FormDescription>Add a short, descriptive headline</FormDescription>
        <FormInput
          className={styles["feedback-form-input"]}
          id="title"
          type="text"
          value={initialValue?.title ?? ""}
          name="title"
        />
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="category">Category</FormLabel>
        <FormDescription>Choose a category for your feedback</FormDescription>
        <Select
          defaultValue={initialValue?.category ?? "ui"}
          onValueChange={(value) => console.log(value)}
        >
          <SelectTrigger
            className={cn(
              styles["feedback-form-input"],
              styles["feedback-form-category"],
            )}
            id="category"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {feedbackCategories.slice(1).map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="detail">Feedback Detail</FormLabel>
        <FormDescription>
          Include any specific comments on what should be improved, added, etc.
        </FormDescription>
        <FormTextarea
          className={styles["feedback-form-input"]}
          id="detail"
          name="detail"
          value={initialValue?.description ?? ""}
        />
      </FormItem>
      {children}
    </Form>
  );
}

export default FeedbackForm;
