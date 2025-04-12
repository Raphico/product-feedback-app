import { Form } from "@/components/form";
import styles from "./reply-form.module.css";
import { useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { useAppForm } from "@/lib/form";
import { createCommentSchema } from "../validations";
import { useCreateCommentMutation } from "../service";
import { showErrorToast } from "@/utils/error";

interface ReplyFormProps extends React.HTMLAttributes<HTMLFormElement> {
  closeForm: () => void;
  feedbackId: string;
  parentId: string | null;
}

function ReplyForm({
  closeForm,
  feedbackId,
  parentId,
  className,
}: ReplyFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [createComment] = useCreateCommentMutation();
  const form = useAppForm({
    defaultValues: {
      content: "",
    },
    validators: {
      onSubmit: createCommentSchema,
    },
    async onSubmit({ value }) {
      try {
        await createComment({
          ...value,
          feedbackId,
          ...(parentId ? { parentId } : {}),
        }).unwrap();
        form.reset();
        closeForm();
      } catch (error) {
        showErrorToast(error);
      }
    },
  });

  useClickOutside({
    ref: formRef,
    handler() {
      closeForm();
    },
  });

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      ref={formRef}
      className={cn(styles["reply-form"], className)}
    >
      <form.AppField
        name="content"
        children={(field) => (
          <>
            <field.FormTextarea
              id="Reply"
              name="Reply"
              aria-label="Type your Reply here"
            />
            <field.FormFieldError />
          </>
        )}
      />
      <form.AppForm>
        <form.SubscribeButton>Post Reply</form.SubscribeButton>
      </form.AppForm>
    </Form>
  );
}

export default ReplyForm;
