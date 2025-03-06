import { cn } from "@/lib/utils";
import styles from "./form.module.css";

function Form({ className, ...props }: React.ComponentPropsWithRef<"form">) {
  return <form className={cn(styles["form"], className)} {...props} />;
}

Form.displayName = "Form";

function FormItem({ className, ...props }: React.ComponentPropsWithRef<"div">) {
  return <div className={cn(styles["form-item"], className)} {...props} />;
}

FormItem.displayName = "FormItem";

function FormLabel({
  className,
  ...props
}: React.ComponentPropsWithRef<"label">) {
  return <label className={cn(styles["form-label"], className)} {...props} />;
}

FormLabel.displayName = "FormLabel";

function FormDescription({
  className,
  ...props
}: React.ComponentPropsWithRef<"p">) {
  return <p className={cn(styles["form-description"], className)} {...props} />;
}

FormDescription.displayName = "FormDescription";

function FormTextarea({
  className,
  ...props
}: React.ComponentPropsWithRef<"textarea">) {
  return (
    <textarea className={cn(styles["form-textarea"], className)} {...props} />
  );
}

FormTextarea.displayName = "FormTextarea";

function FormInput({
  type,
  className,
  ...props
}: React.ComponentPropsWithRef<"input">) {
  return (
    <input
      type={type}
      className={cn(styles["form-input"], className)}
      {...props}
    />
  );
}

FormInput.displayName = "FormInput";

function FormMessage({
  className,
  ...props
}: React.ComponentPropsWithRef<"p">) {
  return <p className={cn(styles["form-message"], className)} {...props} />;
}

FormMessage.displayName = "FormMessage";

export {
  Form,
  FormLabel,
  FormItem,
  FormDescription,
  FormTextarea,
  FormInput,
  FormMessage,
};
