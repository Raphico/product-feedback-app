import { cn } from "@/lib/utils";
import styles from "./form.module.css";
import { useFieldContext, useFormContext } from "@/lib/form/context";
import { Button } from "./button";
import Spinner from "./spinner";
import { useStore } from "@tanstack/react-form";

export type FormProps = React.ComponentProps<"form">;

function Form({ className, ...props }: FormProps) {
  return <form className={cn(styles["form"], className)} {...props} />;
}

Form.displayName = "Form";

export type FormItemProps = React.ComponentProps<"div">;

function FormItem({ className, ...props }: FormItemProps) {
  return <div className={cn(styles["form__item"], className)} {...props} />;
}

FormItem.displayName = "FormItem";

export type FormLabelProps = React.ComponentProps<"label">;

function FormLabel({ className, ...props }: FormLabelProps) {
  return <label className={cn(styles["form__label"], className)} {...props} />;
}

FormLabel.displayName = "FormLabel";

export type FormDescriptionProps = React.ComponentProps<"p">;

function FormDescription({ className, ...props }: FormDescriptionProps) {
  return (
    <p className={cn(styles["form__description"], className)} {...props} />
  );
}

FormDescription.displayName = "FormDescription";

export type FormTextareaProps = React.ComponentProps<"textarea">;

function FormTextarea({ className, ...props }: FormTextareaProps) {
  const field = useFieldContext<string>();

  return (
    <textarea
      value={field.state.value}
      data-state={field.state.meta.errors.length > 0 ? "invalid" : "valid"}
      onChange={(e) => field.handleChange(e.target.value)}
      className={cn(styles["form__textarea"], className)}
      {...props}
    />
  );
}

FormTextarea.displayName = "FormTextarea";

export type FormInputProps = React.ComponentProps<"input">;

function FormInput({ type, className, ...props }: FormInputProps) {
  const field = useFieldContext<string>();

  return (
    <input
      type={type}
      value={field.state.value}
      data-state={field.state.meta.errors.length > 0 ? "invalid" : "valid"}
      onChange={(e) => field.handleChange(e.target.value)}
      className={cn(styles["form__input"], className)}
      {...props}
    />
  );
}

FormInput.displayName = "FormInput";

export type FormFieldErrorProps = React.ComponentProps<"p">;

function FormFieldError({ className, ...props }: FormFieldErrorProps) {
  const field = useFieldContext<string>();

  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className={cn(styles["form__field-error"], className)} {...props}>
          {field.state.meta.errors[0]?.message}
        </p>
      ) : null}
    </>
  );
}

FormFieldError.displayName = "FormFieldError";

export type FormButtonProps = React.ComponentProps<"button">;

function FormButton({ className, children, ...props }: FormButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          size="lg"
          variants="primary"
          className={className}
          disabled={isSubmitting}
          {...props}
        >
          {isSubmitting ? <Spinner /> : children}
        </Button>
      )}
    </form.Subscribe>
  );
}

export type FormErrorAlertProps = React.ComponentProps<"div">;

function FormErrorAlert({ className, ...props }: FormErrorAlertProps) {
  const form = useFormContext();
  const errors = useStore(form.store, (state) => state.errorMap);

  return (
    <>
      {errors.onServer && (
        <div
          role="alert"
          className={cn(styles["form__error-alert"], className)}
          {...props}
        >
          <p>{errors.onServer}</p>
        </div>
      )}
    </>
  );
}

FormErrorAlert.displayName = "FormErrorAlert";

export {
  Form,
  FormLabel,
  FormItem,
  FormDescription,
  FormTextarea,
  FormInput,
  FormFieldError,
  FormButton,
  FormErrorAlert,
};
