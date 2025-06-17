import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import styles from "./index.module.css";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/lib/form";
import { verifyEmailSchema } from "../../validations";
import { getErrorMessage, showErrorToast } from "@/utils/error";
import {
  useResendEmailVerificationMutation,
  useVerifyEmailMutation,
} from "../../service";
import { toast } from "sonner";
import { Form, FormErrorAlert, FormItem } from "@/components/form";
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSlot,
  REGEXP_ONLY_DIGITS,
} from "@/components/otp-input";
import { useEffect, useRef } from "react";

const routeApi = getRouteApi("/_auth/email-verification");

function EmailVerificationPage() {
  const { email } = routeApi.useSearch();
  const navigate = useNavigate();
  const [verifyEmail, { isError, error }] = useVerifyEmailMutation();
  const [resendVerificationEmail, { isLoading: isResendingVerificationEmail }] =
    useResendEmailVerificationMutation();

  const otpInputRef = useRef<HTMLInputElement>(null);

  const form = useAppForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: verifyEmailSchema,
    },
    async onSubmit({ value }) {
      try {
        await verifyEmail(value).unwrap();
        toast.success("Email verification successful");
        navigate({
          to: "/login",
          search: {
            email,
          },
        });
      } catch {
        // empty
      }
    },
  });

  async function handleResendVerification() {
    try {
      if (!email) {
        toast.error("Email not found. Try logging in");
        return;
      }
      await resendVerificationEmail({ email }).unwrap();
      toast.success("Verification email sent");
    } catch (error) {
      showErrorToast(error);
    }
  }

  useEffect(() => {
    if (otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, []);

  return (
    <Card className={styles["email-verification__card"]}>
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your email. This code is valid for 15
          minutes
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
          <FormItem>
            <form.AppField
              name="code"
              children={(field) => (
                <>
                  <OTPInput
                    pattern={REGEXP_ONLY_DIGITS}
                    maxLength={6}
                    ref={otpInputRef}
                    value={field.state.value}
                    onChange={field.handleChange}
                    disabled={form.state.isSubmitting}
                  >
                    <OTPInputGroup
                      className={styles["email-verification__otp-group"]}
                    >
                      <OTPInputSlot index={0} />
                      <OTPInputSlot index={1} />
                      <OTPInputSlot index={2} />
                      <OTPInputSlot index={3} />
                      <OTPInputSlot index={4} />
                      <OTPInputSlot index={5} />
                    </OTPInputGroup>
                  </OTPInput>
                  <field.FormFieldError />
                </>
              )}
            />
          </FormItem>

          <form.AppForm>
            <form.SubscribeButton>Verify</form.SubscribeButton>
          </form.AppForm>
        </Form>

        <p className={styles["email-verification__resend-text"]}>
          Didn't get the code?{" "}
          <button
            onClick={handleResendVerification}
            disabled={isResendingVerificationEmail}
            className={styles["email-verification__resend-button"]}
          >
            Resend Code
          </button>
        </p>
      </CardBody>
    </Card>
  );
}

export default EmailVerificationPage;
