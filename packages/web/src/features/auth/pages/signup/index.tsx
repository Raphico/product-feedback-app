import { Card, CardBody, CardHeader, CardTitle } from "@/components/card";
import { useAppForm } from "@/lib/form";
import { getErrorMessage } from "@/utils/error";
import { getRouteApi } from "@tanstack/react-router";
import { signupSchema } from "../../validations";
import { Form, FormItem, FormLabel } from "@/components/form";
import { Link } from "@tanstack/react-router";
import styles from "./index.module.css";
import { useSignupMutation } from "../../service";
import { useStore } from "@tanstack/react-form";

const routeApi = getRouteApi("/_auth/signup");

function SignupPage() {
  const { email, redirectTo } = routeApi.useSearch();
  const [signup] = useSignupMutation();
  const form = useAppForm({
    defaultValues: {
      fullName: "",
      username: "",
      email: email ?? "",
      password: "",
    },
    validators: {
      onSubmit: signupSchema,
    },
    async onSubmit({ value }) {
      try {
        await signup(value).unwrap();
      } catch (error) {
        form.setErrorMap({ onServer: getErrorMessage(error) });
      }
    },
  });

  const currentEmail = useStore(form.store, (state) => state.values.email);

  return (
    <Card>
      <CardHeader>
        <CardTitle>signup</CardTitle>
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
          <FormItem className={styles["signup__form-item"]}>
            <FormLabel htmlFor="email">Full Name</FormLabel>
            <form.AppField
              name="fullName"
              children={(field) => (
                <>
                  <field.FormInput id="fullName" name="fullName" />
                  <field.FormFieldError />
                </>
              )}
            />
          </FormItem>

          <FormItem className={styles["signup__form-item"]}>
            <FormLabel htmlFor="email">Username</FormLabel>
            <form.AppField
              name="username"
              children={(field) => (
                <>
                  <field.FormInput id="username" name="username" />
                  <field.FormFieldError />
                </>
              )}
            />
          </FormItem>

          <FormItem className={styles["signup__form-item"]}>
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

          <FormItem className={styles["signup__form-item"]}>
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
            <form.SubscribeButton>signup</form.SubscribeButton>
          </form.AppForm>
        </Form>

        <p className={styles["signup__login-text"]}>
          Already have an account?{" "}
          <Link
            to="/login"
            search={{
              email: currentEmail,
              redirectTo,
            }}
            className={`${styles["signup__login-link"]} text-preset-4-bold`}
          >
            login
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}

export default SignupPage;
