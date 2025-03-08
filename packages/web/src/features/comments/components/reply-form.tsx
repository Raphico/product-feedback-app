import { Button } from "@/components/button";
import { Form, FormTextarea } from "@/components/form";
import styles from "./reply-form.module.css";
import { useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

interface ReplyFormProps extends React.HTMLAttributes<HTMLFormElement> {
  closeForm: () => void;
}

function ReplyForm({ closeForm, className }: ReplyFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  useClickOutside({
    ref: formRef,
    handler() {
      closeForm();
    },
  });

  return (
    <Form ref={formRef} className={cn(styles["reply-form"], className)}>
      <FormTextarea aria-label="Reply" name="reply" id="reply" />
      <Button variants="primary">Post Reply</Button>
    </Form>
  );
}

export default ReplyForm;
