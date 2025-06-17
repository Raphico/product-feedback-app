import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useForgotPasswordMutation } from "../../service";
import { useAppForm } from "@/lib/form";
import { emailSchema } from "../../validations";
import { getErrorMessage } from "@/utils/error";
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Form, FormErrorAlert, FormItem, FormLabel } from "@/components/form";
import styles from "./index.module.css";

const routeApi = getRouteApi("/_auth/forgot-password");

function ForgotPasswordPage() {
  const { email } = routeApi.useSearch();
  const navigate = useNavigate();
  const [sendPasswordResetRequest, { isError, error }] =
    useForgotPasswordMutation();
  const form = useAppForm({
    defaultValues: {
      email: email ?? "",
    },
    validators: {
      onSubmit: emailSchema,
    },
    async onSubmit({ value }) {
      try {
        await sendPasswordResetRequest(value).unwrap();
        navigate({
          to: "/forgot-password/sent",
          search: {
            email: value.email,
          },
        });
      } catch {
        // empty
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password?</CardTitle>
        <CardDescription>
          Enter your email address and we will send instructions to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardBody>
        {isError && <FormErrorAlert message={getErrorMessage(error)} />}

        <Form
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FormItem className={styles["forgot-password__form-item"]}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <form.AppField
              name="email"
              children={(field) => (
                <>
                  <field.FormInput
                    disabled={form.state.isSubmitting}
                    id="email"
                    name="email"
                  />
                  <field.FormFieldError />
                </>
              )}
            />
          </FormItem>

          <form.AppForm>
            <form.SubscribeButton>Continue</form.SubscribeButton>
          </form.AppForm>
        </Form>

        <form.Subscribe
          selector={(state) => state.values.email}
          children={(email) => (
            <Link
              to="/login"
              search={{
                email,
              }}
              className={`${styles["forgot-password__login-link"]} text-preset-4-bold`}
            >
              Back to login page
            </Link>
          )}
        />
      </CardBody>
    </Card>
  );
}

export default ForgotPasswordPage;
