import { cn } from "@/lib/utils";
import { Form } from "@/components/form";
import styles from "./add-comment.module.css";
import { useIsLoggedIn } from "@/features/user/hooks";
import { useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/lib/form";
import { createCommentSchema } from "../validations";
import { useCreateCommentMutation } from "../service";
import { showErrorToast } from "@/utils/error";

interface AddCommentProps extends React.HTMLAttributes<HTMLElement> {
  redirectContext: string;
  feedbackId: string;
}

function AddComment({
  className,
  redirectContext,
  feedbackId,
}: AddCommentProps) {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
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
        await createComment({ ...value, feedbackId }).unwrap();
        form.reset();
      } catch (error) {
        showErrorToast(error);
      }
    },
  });

  function handleOnFocus() {
    if (!isLoggedIn) {
      navigate({
        to: "/login",
        search: {
          redirectTo: redirectContext,
        },
      });
    }
  }

  return (
    <section className={cn(styles["add-comment"], className)}>
      <h2 className="h3">Add Comment</h2>
      <Form
        className={styles["add-comment__form"]}
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="content"
          children={(field) => (
            <>
              <field.FormTextarea
                id="comment"
                name="comment"
                aria-label="Type your comment here"
                placeholder="Type your comment here"
                onFocus={handleOnFocus}
                disabled={form.state.isSubmitting}
              />
              <field.FormFieldError />
            </>
          )}
        />
        <form.Subscribe
          selector={(state) => 250 - state.values.content.length}
          children={(charactersLeft) => (
            <p className={styles["add-comment__characters"]}>
              {charactersLeft} characters left
            </p>
          )}
        />
        <form.AppForm>
          <form.SubscribeButton className={styles["add-comment__button"]}>
            Post Comment
          </form.SubscribeButton>
        </form.AppForm>
      </Form>
    </section>
  );
}

export default AddComment;
