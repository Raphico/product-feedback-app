import { cn } from "@/lib/utils";
import { Form } from "@/components/form";
import styles from "./add-comment.module.css";
import { Button } from "@/components/button";
import { useIsLoggedIn } from "@/features/user/hooks";
import { useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/lib/form";

interface AddCommentProps extends React.HTMLAttributes<HTMLElement> {
  redirectContext: string;
}

function AddComment({ className, redirectContext }: AddCommentProps) {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const form = useAppForm({
    defaultValues: {
      comment: "",
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
      <Form className={styles["add-comment__form"]}>
        <form.AppField
          name="comment"
          children={(field) => (
            <>
              <field.FormTextarea
                id="comment"
                name="comment"
                aria-label="Type your comment here"
                placeholder="Type your comment here"
                onFocus={handleOnFocus}
              />
              <field.FormFieldError />
            </>
          )}
        />
        <p className={styles["add-comment__characters"]}>250 characters left</p>
        <Button
          variants="primary"
          type="submit"
          className={styles["add-comment__button"]}
        >
          Post Comment
        </Button>
      </Form>
    </section>
  );
}

export default AddComment;
