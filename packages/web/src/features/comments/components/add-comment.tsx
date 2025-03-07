import { cn } from "@/lib/utils";
import { Form, FormTextarea } from "@/components/form";
import styles from "./add-comment.module.css";
import { Button } from "@/components/button";

function AddComment({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn(styles["add-comment"], className)}>
      <h2 className="h3">Add Comment</h2>
      <Form className={styles["add-comment__form"]}>
        <FormTextarea
          aria-label="comment"
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
