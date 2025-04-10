import { cn } from "@/lib/utils";
import { Form, FormTextarea } from "@/components/form";
import styles from "./add-comment.module.css";
import { Button } from "@/components/button";
import { useIsLoggedIn } from "@/features/user/hooks";
import { useNavigate } from "@tanstack/react-router";

interface AddCommentProps extends React.HTMLAttributes<HTMLElement> {
  redirectContext: string;
}

function AddComment({ className, redirectContext }: AddCommentProps) {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

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
        <FormTextarea
          aria-label="comment"
          onFocus={handleOnFocus}
          placeholder="Type your comment here"
          id="comment"
          name="comment"
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
