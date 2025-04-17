import { Card, CardBody, CardHeader, CardTitle } from "@/components/card";
import styles from "./index.module.css";
import { Form, FormItem, FormLabel } from "@/components/form";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useLoginMutation } from "@/features/auth/service";
import { loginSchema } from "@/features/auth/validations";
import { useAppForm } from "@/lib/form";
import { getErrorMessage } from "@/utils/error";
import { useStore } from "@tanstack/react-form";

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
        form.setErrorMap({ onServer: getErrorMessage(error) });
      }
    },
  });

  const currentEmail = useStore(form.store, (state) => state.values.email);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
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
          <FormItem className={styles["login__form-item"]}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <form.AppField
              name="email"
              children={(field) => (
                <>
                  <field.FormInput id="email" type="email" name="email" />
                  <field.FormFieldError />
                </>
              )}
            />
          </FormItem>

          <FormItem className={styles["login__form-item"]}>
            <div className={styles["login__password-label"]}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                to="/forgot-password"
                search={{
                  email: form.getFieldValue("email"),
                  redirectTo,
                }}
                className={styles["login__forgot-password"]}
              >
                Forgot password?
              </Link>
            </div>
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
            <form.SubscribeButton>Login</form.SubscribeButton>
          </form.AppForm>
        </Form>

        <p className={styles["login__signup-text"]}>
          Need to create an account?{" "}
          <Link
            to="/signup"
            search={{
              email: currentEmail,
              redirectTo,
            }}
            className={`${styles["login__signup-link"]} text-preset-4-bold`}
          >
            Sign up
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}

export default LoginPage;
