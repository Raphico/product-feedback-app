import { useNavigate } from "@tanstack/react-router";
import { resetPasswordSchema } from "../../validations";
import { useAppForm } from "@/lib/form";
import { getErrorMessage } from "@/utils/error";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/card";
import { Form, FormItem, FormLabel } from "@/components/form";
import { useResetPasswordMutation } from "../../service";
import { getRouteApi } from "@tanstack/react-router";
import styles from "./index.module.css";
import { toast } from "sonner";

const routeApi = getRouteApi("/_auth/reset-password/$token");

function ResetPasswordPage() {
  const { token } = routeApi.useParams();
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();
  const form = useAppForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    async onSubmit({ value }) {
      try {
        await resetPassword({ ...value, token }).unwrap();
        toast.success("Password reset successful");
        navigate({
          to: "/login",
        });
      } catch (error) {
        form.setErrorMap({ onServer: getErrorMessage(error) });
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardBody>
        <form.AppForm>
          <form.FormErrorAlert />
        </form.AppForm>
        <Form
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FormItem className={styles["reset-password__form-item"]}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <form.AppField
              name="password"
              children={(field) => (
                <>
                  <field.PasswordInput id="password" name="password" />
                  <field.FormFieldError />
                </>
              )}
            />
          </FormItem>

          <form.AppForm>
            <form.SubscribeButton>Reset Password</form.SubscribeButton>
          </form.AppForm>
        </Form>
      </CardBody>
    </Card>
  );
}

export default ResetPasswordPage;
