import { Card, CardBody, CardHeader, CardTitle } from "@/components/card";
import styles from "./index.module.css";
import { Form, FormItem, FormLabel } from "@/components/form";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useLoginMutation } from "@/features/auth/service";
import { loginSchema } from "@/features/auth/validation";
import { useAppForm } from "@/lib/form";
import { isHttpBaseQueryError } from "@/lib/http/utils";

const routeApi = getRouteApi("/_auth/login");

function LoginPage() {
  const { email, redirectTo } = routeApi.useSearch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const form = useAppForm({
    defaultValues: {
      email: email ?? "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    async onSubmit({ value }) {
      try {
        await login(value).unwrap();
        navigate({
          to: redirectTo ?? "/",
        });
      } catch (error) {
        const errorMessage = isHttpBaseQueryError(error)
          ? error.data.message
          : "Something went wrong. Please try again later";

        form.setErrorMap({ onServer: errorMessage });
      }
    },
  });

  return (
    <div className={styles["login"]}>
      <Card className={styles["login__card"]}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardBody>
          <form.AppForm>
            <form.FormErrorAlert className={styles["login__error-alert"]} />
          </form.AppForm>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              form.handleSubmit();
            }}
          >
            <FormItem className={styles["login__form-item"]}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <form.AppField
                name="email"
                children={(field) => (
                  <>
                    <field.FormInput id="email" name="email" />
                    <field.FormFieldError />
                  </>
                )}
              />
            </FormItem>

            <FormItem className={styles["login__form-item"]}>
              <div className={styles["login__password-label"]}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link to="." className={styles["login__forgot-password"]}>
                  Forgot password?
                </Link>
              </div>
              <form.AppField
                name="password"
                children={(field) => (
                  <>
                    <field.FormInput id="password" name="password" />
                    <field.FormFieldError />
                  </>
                )}
              />
            </FormItem>

            <form.AppForm>
              <form.SubscribeButton className={styles["login__button"]}>
                Login
              </form.SubscribeButton>
            </form.AppForm>
          </Form>

          <p className={styles["login__signup-text"]}>
            Need to create an account?{" "}
            <Link
              to="."
              className={`${styles["login__signup-link"]} text-preset-4-bold`}
            >
              Sign up
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginPage;
